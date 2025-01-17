const addJob = async (queue, job, jobOptions = {}) => {
  const options = { removeOnComplete: false, ...jobOptions };
  await queue.add(job.name, job, options);
};

module.exports = { addJob };
