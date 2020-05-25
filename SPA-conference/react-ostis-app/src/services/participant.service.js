import http from "../http-common";

class ParticipantDataService {
  getAll() {
    return http.get("/participants");
  }

  get(id) {
    return http.get(`/participants/${id}`);
  }

  create(data) {
    return http.post("/participants", data);
  }

  update(id, data) {
    return http.put(`/participants/${id}`, data);
  }

  delete(id) {
    return http.delete(`/participants/${id}`);
  }

  deleteAll() {
    return http.delete(`/participants`);
  }

  findByFIO(fio) {
    return http.get(`/participants?fio=${fio}`);
  }
}

export default new ParticipantDataService();