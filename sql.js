const pool = require('./details.js');

pool.query('SELECT * FROM task WHERE organization_id = ? AND due_date = CAST(CURDATE() + INTERVAL 1 DAY AS DATE);', [136], (err, results) => {
  if (err) {
    console.error('Error executing the query:', err);
  } else {
    console.log('Query results:', results);
  }
});
