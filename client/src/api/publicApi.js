import http from "./http";

export async function fetchSiteSnapshot() {
  const { data } = await http.get("/public/site");
  return data;
}

export async function fetchProjects() {
  const { data } = await http.get("/public/projects");
  return data;
}

export async function fetchShowcase(category) {
  const { data } = await http.get("/public/showcase", {
    params: category ? { category } : {}
  });
  return data;
}

export async function submitContact(payload) {
  const { data } = await http.post("/public/contact", payload);
  return data;
}
