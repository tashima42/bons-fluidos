const envBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const BASE_URL = envBaseUrl ? envBaseUrl : "https://bons-fluidos.tashima.space";

async function signIn(email, password) {
  return await makeRequest("/user/signin", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

async function myInfo() {
  return await makeRequest("/user/me", { method: "GET" });
}

async function events() {
  return await makeRequest("/events", { method: "GET" });
}

async function generalVolunteers() {
  return await makeRequest("/forms/volunteer", { method: "GET" });
}

const deleteEvent = async (eventId) => {
  return await makeRequest(`/event/${eventId}`, {
    method: "DELETE",
  });
};

const eventVolunteers = async (eventId) => {
  return await makeRequest(`/event/${eventId}/volunteers`, {
    method: "GET",
  });
};

const addVolunteerToEvent = async (eventId, volunteerId) => {
  return await makeRequest(`/event/${eventId}/volunteer/${volunteerId}`, {
    method: "POST",
  });
};

const createEvent = async (event) => {
  return await makeRequest("/event", {
    method: "POST",
    body: JSON.stringify(event),
  });
};

const createVolunteer = async (obj) => {
  return await makeRequest("/forms/volunteer", {
    method: "POST",
    body: JSON.stringify(obj),
  });
};

async function makeRequest(path, options) {
  if (envBaseUrl == "") {
    throw new Erro("missing base url");
  }
  options.redirect = "follow";
  options.credentials = "include";
  const res = await fetch(BASE_URL + path, options);
  if (res.status === 401) {
    throw new Error("user not authenticated");
  }
  return res.json();
}

export {
  signIn,
  myInfo,
  createEvent,
  events,
  deleteEvent,
  createVolunteer,
  eventVolunteers,
  generalVolunteers,
  addVolunteerToEvent,
};
