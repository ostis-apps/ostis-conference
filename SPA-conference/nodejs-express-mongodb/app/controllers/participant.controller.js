const db = require("../models");
const Participant = db.participants;


exports.create = (req, res) => {
  // Validate request
  if (!req.body.fio) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Participant
  const participant = new Participant({
    fio: req.body.fio,
    rank: req.body.rank,
    email: req.body.email,
    country: req.body.country,
    city: req.body.city,
    phone: req.body.phone,
    participation: req.body.participation ? req.body.participation : false
  });

  // Save Participant in the database
  participant
    .save(participant)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the participant."
      });
    });
};

exports.findAll = (req, res) => {
  const fio = req.query.fio;
  let condition = fio ? { fio: { $regex: new RegExp(fio), $options: "i" } } : {};

  Participant.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving participants."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Participant.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found participant with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving participant with id=" + id });
    });
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Participant.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update participant with id=${id}. Maybe participant was not found!`
        });
      } else res.send({ message: "participant was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating participant with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Participant.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete participant with id=${id}. Maybe participant was not found!`
        });
      } else {
        res.send({
          message: "participant was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete participant with id=" + id
      });
    });
};

exports.deleteAll = (req, res) => {
  Participant.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} participants were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all participants."
      });
    });
};

exports.findAllParticipation = (req, res) => {
  Participant.find({ participation: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving participants."
      });
    });
};