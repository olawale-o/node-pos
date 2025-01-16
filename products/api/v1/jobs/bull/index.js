const addJob = async (queue, job) => {
  await queue.add(job.name, job);
};

module.exports = { addJob };
