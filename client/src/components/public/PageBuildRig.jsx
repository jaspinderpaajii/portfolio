import { useEffect, useRef, useState } from "react";

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function smooth(value) {
  return value * value * (3 - 2 * value);
}

function shiftedPhase(value, start, span) {
  return clamp((value - start) / span);
}

function payloadOpacityForPhase(value) {
  if (value < 0.58) {
    return 1;
  }

  if (value < 0.8) {
    return 1 - smooth((value - 0.58) / 0.22);
  }

  return 0;
}

function PageBuildRig() {
  const phaseStartRef = useRef(0);
  const activeKeyRef = useRef("");
  const activeSurfaceRef = useRef(null);
  const [rig, setRig] = useState({
    progress: 0,
    targetX: 50,
    targetY: 18,
    leftTargetY: 18,
    rightTargetY: 24,
    leftTargetX: 24,
    rightTargetX: 76,
    localProgress: 0,
    activeType: "hero",
    phaseProgress: 1
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    let frame = 0;

    function getPhaseDuration(type) {
      if (type === "projects" || type === "showcase") {
        return 6000;
      }

      if (type === "about" || type === "skills") {
        return 5400;
      }

      if (type === "contact") {
        return 5600;
      }

      return 4300;
    }

    function getSurfaceType(section) {
      const className = section.className || "";

      if (className.includes("build-projects")) {
        return "projects";
      }

      if (className.includes("build-showcase")) {
        return "showcase";
      }

      if (className.includes("build-skills")) {
        return "skills";
      }

      if (className.includes("build-about")) {
        return "about";
      }

      if (className.includes("build-contact")) {
        return "contact";
      }

      if (className.includes("build-tools")) {
        return "tools";
      }

      return "hero";
    }

    function isSurfaceInRange(section) {
      const rect = section.getBoundingClientRect();

      return rect.bottom > window.innerHeight * 0.08 && rect.top < window.innerHeight * 0.76;
    }

    function resolveArmTarget(section, selector, rect, fallbackX, fallbackY) {
      const target = section.querySelector(selector);
      const targetRect = target?.getBoundingClientRect();
      const hasTarget = targetRect && targetRect.width > 0 && targetRect.height > 0;
      const x = hasTarget ? targetRect.left + targetRect.width * 0.5 : rect.left + rect.width * fallbackX;
      const y = hasTarget ? targetRect.top + targetRect.height * 0.5 : rect.top + rect.height * fallbackY;

      return {
        x: clamp((x / window.innerWidth) * 100, 8, 92),
        y: clamp((y / window.innerHeight) * 100, 12, 78)
      };
    }

    function resolvePhaseProgress(key, type, now) {
      if (activeKeyRef.current !== key) {
        activeKeyRef.current = key;
        phaseStartRef.current = now;
      }

      return clamp((now - phaseStartRef.current) / getPhaseDuration(type));
    }

    function finishFrame(phaseProgress) {
      if (phaseProgress < 1 && !frame) {
        frame = window.setTimeout(updateProgress, 40);
      } else {
        frame = 0;
      }
    }

    function requestSurfaceBuild(section) {
      if (!section || !isSurfaceInRange(section)) {
        return;
      }

      if (section.classList.contains("motion-reveal-prep") || section.classList.contains("motion-reveal-visible")) {
        return;
      }

      window.dispatchEvent(new CustomEvent("portfolio:build-surface-prepare", {
        detail: { target: section }
      }));
    }

    function updateProgress() {
      frame = 0;
      const now = window.performance.now();
      const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const progress = clamp(window.scrollY / scrollable);
      const sections = Array.from(document.querySelectorAll(".build-surface"));
      const workLine = window.innerHeight * 0.66;
      let active = null;
      let activeDistance = Number.POSITIVE_INFINITY;
      const announcedSurface = activeSurfaceRef.current;

      if (announcedSurface && sections.includes(announcedSurface) && isSurfaceInRange(announcedSurface)) {
        const rect = announcedSurface.getBoundingClientRect();
        active = {
          section: announcedSurface,
          rect,
          center: rect.top + rect.height * 0.42
        };
      }

      if (!active) {
        sections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          const center = rect.top + rect.height * 0.42;
          const distance = Math.abs(center - workLine);

          if (distance < activeDistance) {
            active = { section, rect, center };
            activeDistance = distance;
          }
        });
      }

      if (!active) {
        const phaseProgress = resolvePhaseProgress("hero:idle", "hero", now);
        const idleTargetY = 18 + progress * 58;
        setRig({
          progress,
          targetX: 50,
          targetY: idleTargetY,
          leftTargetY: idleTargetY - 4,
          rightTargetY: idleTargetY + 4,
          leftTargetX: 24,
          rightTargetX: 76,
          localProgress: progress,
          activeType: "hero",
          phaseProgress
        });
        finishFrame(phaseProgress);
        return;
      }

      const localProgress = clamp((workLine - active.rect.top) / Math.max(active.rect.height * 0.86, 1));
      const activeType = getSurfaceType(active.section);
      const leftTarget = resolveArmTarget(active.section, ".build-arm-target-left", active.rect, 0.25, 0.36);
      const rightTarget = resolveArmTarget(active.section, ".build-arm-target-right", active.rect, 0.75, 0.52);
      const targetX = activeType === "projects" || activeType === "showcase" || activeType === "skills" || activeType === "about" || activeType === "tools"
        ? rightTarget.x
        : clamp((leftTarget.x + rightTarget.x) * 0.5, 18, 82);
      const targetY = clamp((leftTarget.y + rightTarget.y) * 0.5, 12, 74);
      requestSurfaceBuild(active.section);
      const phaseProgress = resolvePhaseProgress(`${activeType}:${sections.indexOf(active.section)}`, activeType, now);
      setRig({
        progress,
        targetX,
        targetY,
        leftTargetY: leftTarget.y,
        rightTargetY: rightTarget.y,
        leftTargetX: leftTarget.x,
        rightTargetX: rightTarget.x,
        localProgress,
        activeType,
        phaseProgress
      });
      finishFrame(phaseProgress);
    }

    function requestUpdate() {
      if (!frame) {
        frame = window.setTimeout(updateProgress, 0);
      }
    }

    function handleBuildSurfaceVisible(event) {
      const target = event.detail?.target;

      if (!target || !target.classList?.contains("build-surface")) {
        return;
      }

      activeSurfaceRef.current = target;
      activeKeyRef.current = "";
      phaseStartRef.current = window.performance.now();
      requestUpdate();
    }

    updateProgress();
    window.addEventListener("portfolio:build-surface-visible", handleBuildSurfaceVisible);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame) {
        window.clearTimeout(frame);
      }

      window.removeEventListener("portfolio:build-surface-visible", handleBuildSurfaceVisible);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  const { progress, targetX, targetY, leftTargetY, rightTargetY, leftTargetX, rightTargetX, localProgress, activeType, phaseProgress } = rig;
  const buildPhase = phaseProgress < 0.34
    ? "approach"
    : phaseProgress < 0.68
      ? "drop"
      : phaseProgress < 0.9
        ? "lock"
        : "reset";
  const approachStroke = smooth(clamp(phaseProgress / 0.42));
  const dropStroke = smooth(clamp((phaseProgress - 0.36) / 0.32));
  const lockStroke = smooth(clamp((phaseProgress - 0.68) / 0.16));
  const resetStroke = smooth(clamp((phaseProgress - 0.9) / 0.1));
  const pullStroke = approachStroke * (1 - resetStroke * 0.82);
  const activeBias = activeType === "skills" ? 2 : activeType === "about" ? 0 : activeType === "contact" ? -1.5 : 0;
  const reach = activeType === "projects" || activeType === "showcase" ? 1.12 : activeType === "contact" ? 0.82 : 1;
  const leftReach = clamp(0.84 + (leftTargetX / 100) * 0.5, 0.88, 1.22);
  const rightReach = clamp(0.84 + ((100 - rightTargetX) / 100) * 0.5, 0.88, 1.22);
  const leftPhase = shiftedPhase(phaseProgress, 0, 0.86);
  const rightPhase = shiftedPhase(phaseProgress, activeType === "hero" ? 0.08 : 0.14, activeType === "hero" ? 0.86 : 0.8);
  const leftApproachStroke = smooth(clamp(leftPhase / 0.42));
  const leftDropStroke = smooth(clamp((leftPhase - 0.34) / 0.34));
  const leftLockStroke = smooth(clamp((leftPhase - 0.68) / 0.16));
  const leftResetStroke = smooth(clamp((leftPhase - 0.9) / 0.1));
  const rightApproachStroke = smooth(clamp(rightPhase / 0.42));
  const rightDropStroke = smooth(clamp((rightPhase - 0.34) / 0.34));
  const rightLockStroke = smooth(clamp((rightPhase - 0.68) / 0.16));
  const rightResetStroke = smooth(clamp((rightPhase - 0.9) / 0.1));
  const leftPullStroke = leftApproachStroke * (1 - leftResetStroke * 0.82);
  const rightPullStroke = rightApproachStroke * (1 - rightResetStroke * 0.82);
  const leftSharedY = leftTargetY + activeBias + leftPullStroke * (5.8 * leftReach) + leftDropStroke * (1.75 * leftReach) - leftResetStroke * 6.2;
  const rightSharedY = rightTargetY + activeBias + rightPullStroke * (6.5 * rightReach) + rightDropStroke * (2.45 * rightReach) - rightResetStroke * 6.2;
  const leftArmInset = -8.2 + clamp((leftTargetX - 22) * 0.085, -0.8, 4.2);
  const rightArmInset = -8.2 + clamp(((100 - rightTargetX) - 22) * 0.085, -0.8, 4.2);
  const primaryArm = activeType === "about"
    ? "both"
    : activeType === "skills"
      ? "both"
      : activeType === "tools"
        ? "left"
        : "both";
  const leftYOffset = activeType === "projects"
    ? -7
    : activeType === "showcase"
      ? -6
      : activeType === "about"
        ? -8
        : activeType === "skills"
          ? -7
          : activeType === "contact"
            ? -7
            : activeType === "hero"
              ? -3
              : 0;
  const rightYOffset = activeType === "projects"
    ? 6
    : activeType === "showcase"
      ? 7
      : activeType === "about"
        ? 2
        : activeType === "skills"
          ? 3
          : activeType === "contact"
            ? 4
            : 9;
  const leftArmY = clamp(leftSharedY + leftYOffset, 8, 78);
  const rightArmY = clamp(rightSharedY + rightYOffset, 8, 78);
  const workTargetY = clamp(targetY + (buildPhase === "lock" ? 8 : 9) + dropStroke * 1.8, 16, 84);
  const leftShoulder = -44 + leftPullStroke * (42 * leftReach) - leftDropStroke * 9 - leftResetStroke * 18;
  const leftElbow = 78 - leftPullStroke * (44 * leftReach) + leftDropStroke * 10 + leftResetStroke * 16;
  const leftWrist = -28 + leftPullStroke * (34 * leftReach) - leftDropStroke * 9 - leftResetStroke * 12;
  const rightShoulder = 44 - rightPullStroke * (38 * rightReach) + rightDropStroke * 7 + rightResetStroke * 18;
  const rightElbow = -78 + rightPullStroke * (44 * rightReach) - rightDropStroke * 10 - rightResetStroke * 16;
  const rightWrist = 28 - rightPullStroke * (34 * rightReach) + rightDropStroke * 8 + rightResetStroke * 12;
  const releaseWindow = smooth(clamp((phaseProgress - 0.42) / 0.24)) * (1 - smooth(clamp((phaseProgress - 0.76) / 0.14)));
  const leftReleaseWindow = smooth(clamp((leftPhase - 0.4) / 0.24)) * (1 - smooth(clamp((leftPhase - 0.76) / 0.14)));
  const rightReleaseWindow = smooth(clamp((rightPhase - 0.4) / 0.24)) * (1 - smooth(clamp((rightPhase - 0.76) / 0.14)));
  const clawOpen = activeType === "contact"
    ? 0.14 + releaseWindow * 0.58 + resetStroke * 0.28
    : 0.16 + releaseWindow * 0.68 + resetStroke * 0.34;
  const leftClawOpen = 0.14 + leftReleaseWindow * 0.64 + leftResetStroke * 0.3;
  const rightClawOpen = activeType === "contact"
    ? 0.14 + rightReleaseWindow * 0.58 + rightResetStroke * 0.28
    : 0.16 + rightReleaseWindow * 0.68 + rightResetStroke * 0.34;
  const payloadOpacity = phaseProgress < 0.56
    ? 1
    : phaseProgress < 0.78
      ? 1 - smooth((phaseProgress - 0.56) / 0.22)
      : 0;
  const leftPayloadOpacity = payloadOpacityForPhase(leftPhase);
  const rightPayloadOpacity = payloadOpacityForPhase(rightPhase);
  const assistLock = smooth(clamp((phaseProgress - 0.54) / 0.28)) * (1 - resetStroke * 0.72);
  const assistOneX = activeType === "projects" || activeType === "showcase" ? "-22rem" : "-17rem";
  const assistTwoX = activeType === "projects" || activeType === "showcase" ? "18rem" : "14rem";
  const assistY = clamp(workTargetY - 6.4 + dropStroke * 3.2, 12, 76);
  const deliveryRoute = activeType === "projects" || activeType === "showcase"
    ? "frame-lift"
    : activeType === "skills"
      ? "tile-feed"
      : activeType === "about"
        ? "right-place"
        : activeType === "contact"
          ? "seal-drop"
          : "hero-place";
  const deliveryProgress = smooth(clamp((phaseProgress - 0.08) / 0.52));
  const deliveryStartX = deliveryRoute === "seal-drop"
    ? "0vw"
    : deliveryRoute === "tile-feed" || deliveryRoute === "right-place"
      ? "34vw"
      : deliveryRoute === "frame-lift"
        ? activeType === "showcase" ? "24vw" : "-24vw"
        : primaryArm === "right"
          ? "30vw"
          : "-30vw";
  const deliveryStartY = deliveryRoute === "seal-drop"
    ? "-20vh"
    : deliveryRoute === "frame-lift"
      ? "-8vh"
      : "0rem";
  const deliveryLift = -2.8 + approachStroke * -1.6 + dropStroke * 3.8 - lockStroke * 0.55;
  const deliveryOpacity = phaseProgress < 0.04 || phaseProgress > 0.88
    ? 0
    : phaseProgress < 0.2
      ? smooth(clamp((phaseProgress - 0.04) / 0.16))
      : phaseProgress < 0.76
        ? 1
        : 1 - smooth(clamp((phaseProgress - 0.76) / 0.12));
  const deliveryScale = 0.84 + deliveryProgress * 0.2 - lockStroke * 0.03;
  const deliveryTilt = primaryArm === "right"
    ? -7 + dropStroke * 5 - lockStroke * 3
    : 7 - dropStroke * 5 + lockStroke * 3;
  const boltProgress = smooth(clamp((phaseProgress - 0.66) / 0.18)) * (1 - resetStroke);
  const lockFeedback = lockStroke * (1 - resetStroke);

  return (
    <div
      className="page-build-rig"
      data-active-build={activeType}
      data-build-phase={buildPhase}
      data-delivery-route={deliveryRoute}
      data-phase-progress={phaseProgress.toFixed(3)}
      data-primary-arm={primaryArm}
      aria-hidden="true"
      style={{
        "--page-progress": progress,
        "--section-progress": localProgress,
        "--phase-progress": phaseProgress,
        "--work-target-x": `${targetX}%`,
        "--work-target-y": `${workTargetY}%`,
        "--left-target-x": leftTargetX,
        "--right-target-x": rightTargetX,
        "--left-arm-inset": `${leftArmInset}rem`,
        "--right-arm-inset": `${rightArmInset}rem`,
        "--left-arm-y": `${leftArmY}%`,
        "--right-arm-y": `${rightArmY}%`,
        "--left-shoulder": `${leftShoulder}deg`,
        "--left-elbow": `${leftElbow}deg`,
        "--left-wrist": `${leftWrist}deg`,
        "--right-shoulder": `${rightShoulder}deg`,
        "--right-elbow": `${rightElbow}deg`,
        "--right-wrist": `${rightWrist}deg`,
        "--claw-open": clawOpen,
        "--left-claw-open": leftClawOpen,
        "--right-claw-open": rightClawOpen,
        "--payload-opacity": payloadOpacity,
        "--left-payload-opacity": leftPayloadOpacity,
        "--right-payload-opacity": rightPayloadOpacity,
        "--drop-stroke": dropStroke,
        "--left-drop-stroke": leftDropStroke,
        "--right-drop-stroke": rightDropStroke,
        "--lock-stroke": lockStroke,
        "--left-lock-stroke": leftLockStroke,
        "--right-lock-stroke": rightLockStroke,
        "--assist-lock": assistLock,
        "--assist-one-x": assistOneX,
        "--assist-two-x": assistTwoX,
        "--assist-y": `${assistY}%`,
        "--delivery-progress": deliveryProgress,
        "--delivery-start-x": deliveryStartX,
        "--delivery-start-y": deliveryStartY,
        "--delivery-y": `${deliveryLift}rem`,
        "--delivery-opacity": deliveryOpacity,
        "--delivery-scale": deliveryScale,
        "--delivery-tilt": `${deliveryTilt}deg`,
        "--bolt-progress": boltProgress,
        "--lock-feedback": lockFeedback
      }}
    >
      <div className="page-build-beam" />
      <div className="page-build-target">
        <span />
        <span />
        <i />
      </div>
      <div className="robot-delivery-packet">
        <span className="robot-delivery-shell" />
        <span className="robot-delivery-content robot-delivery-content-one" />
        <span className="robot-delivery-content robot-delivery-content-two" />
        <span className="robot-delivery-content robot-delivery-content-three" />
        <i />
        <b />
      </div>
      <div className="robot-delivery-bolts">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="robot-lock-feedback">
        <span />
        <span />
        <span />
        <span />
        <i />
      </div>
      <div className="robot-precision-arm robot-precision-arm-one">
        <span className="robot-precision-carriage" />
        <span className="robot-precision-link robot-precision-link-one" />
        <span className="robot-precision-joint robot-precision-joint-mid" />
        <span className="robot-precision-link robot-precision-link-two" />
        <span className="robot-precision-tool" />
      </div>
      <div className="robot-precision-arm robot-precision-arm-two">
        <span className="robot-precision-carriage" />
        <span className="robot-precision-link robot-precision-link-one" />
        <span className="robot-precision-joint robot-precision-joint-mid" />
        <span className="robot-precision-link robot-precision-link-two" />
        <span className="robot-precision-tool" />
      </div>
      <div className="robot-scroll-arm robot-scroll-arm-left">
        <div className="robot-scroll-mount" />
        <div className="robot-scroll-joint robot-scroll-shoulder" />
        <div className="robot-scroll-upper">
          <span className="robot-scroll-panel robot-scroll-panel-one" />
          <span className="robot-scroll-panel robot-scroll-panel-two" />
          <div className="robot-scroll-joint robot-scroll-elbow" />
          <div className="robot-scroll-forearm">
            <span className="robot-scroll-panel robot-scroll-panel-three" />
            <div className="robot-scroll-joint robot-scroll-wrist" />
            <div className="robot-scroll-gripper">
              <span className="robot-scroll-finger robot-scroll-finger-top" />
              <span className="robot-scroll-finger robot-scroll-finger-bottom" />
              <span className="robot-scroll-payload" />
              <span className="robot-scroll-spark robot-scroll-spark-one" />
              <span className="robot-scroll-spark robot-scroll-spark-two" />
            </div>
          </div>
        </div>
      </div>
      <div className="robot-scroll-arm robot-scroll-arm-right">
        <div className="robot-scroll-mount" />
        <div className="robot-scroll-joint robot-scroll-shoulder" />
        <div className="robot-scroll-upper">
          <span className="robot-scroll-panel robot-scroll-panel-one" />
          <span className="robot-scroll-panel robot-scroll-panel-two" />
          <div className="robot-scroll-joint robot-scroll-elbow" />
          <div className="robot-scroll-forearm">
            <span className="robot-scroll-panel robot-scroll-panel-three" />
            <div className="robot-scroll-joint robot-scroll-wrist" />
            <div className="robot-scroll-gripper">
              <span className="robot-scroll-finger robot-scroll-finger-top" />
              <span className="robot-scroll-finger robot-scroll-finger-bottom" />
              <span className="robot-scroll-payload" />
              <span className="robot-scroll-spark robot-scroll-spark-one" />
              <span className="robot-scroll-spark robot-scroll-spark-two" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageBuildRig;
