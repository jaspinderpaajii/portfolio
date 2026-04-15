import http from "./http";

export async function loginAdmin(payload) {
  const { data } = await http.post("/auth/login", payload);
  return data;
}

export async function fetchCurrentAdmin() {
  const { data } = await http.get("/auth/me");
  return data;
}

export async function fetchDashboard() {
  const { data } = await http.get("/admin/dashboard");
  return data;
}

export async function fetchSection(sectionKey) {
  const { data } = await http.get(`/admin/sections/${sectionKey}`);
  return data;
}

export async function saveSection(sectionKey, payload) {
  const { data } = await http.put(`/admin/sections/${sectionKey}`, payload);
  return data;
}

export async function fetchProjectsAdmin() {
  const { data } = await http.get("/admin/projects");
  return data;
}

export async function createProject(payload) {
  const { data } = await http.post("/admin/projects", payload);
  return data;
}

export async function updateProject(id, payload) {
  const { data } = await http.put(`/admin/projects/${id}`, payload);
  return data;
}

export async function deleteProject(id) {
  const { data } = await http.delete(`/admin/projects/${id}`);
  return data;
}

export async function reorderProjects(ids) {
  const { data } = await http.patch("/admin/projects/reorder", { ids });
  return data;
}

export async function fetchVideosAdmin() {
  const { data } = await http.get("/admin/videos");
  return data;
}

export async function createVideo(payload) {
  const { data } = await http.post("/admin/videos", payload);
  return data;
}

export async function updateVideo(id, payload) {
  const { data } = await http.put(`/admin/videos/${id}`, payload);
  return data;
}

export async function deleteVideo(id) {
  const { data } = await http.delete(`/admin/videos/${id}`);
  return data;
}

export async function reorderVideos(ids) {
  const { data } = await http.patch("/admin/videos/reorder", { ids });
  return data;
}

export async function uploadAsset(file, resourceType = "image") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("resourceType", resourceType);

  const { data } = await http.post("/admin/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return data;
}
