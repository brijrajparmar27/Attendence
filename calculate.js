const data = require("./data");
const fs = require("fs");

const validAttendence = (targetId, targetDate) => {
  const filteredPunches = data.filter((punch) => punch.Date === targetDate);

  // Reduce filtered array to get attendance for target ID
  const attendance = filteredPunches.reduce(
    (acc, punch) => {
      if (punch.ID === targetId) {
        if (punch.punch === "IN") {
          acc.in++;
        } else {
          acc.out++;
        }
      }
      return acc;
    },
    { in: 0, out: 0 }
  );

  // Check if attendance is balanced
  if (attendance.in === attendance.out) {
    return true;
  } else {
    return false;
  }
};

const calculateIDDates = () => {
  const result = data.reduce((acc, { ID, Date }) => {
    if (!acc[ID]) {
      acc[ID] = [];
    }
    if (!acc[ID].includes(Date)) {
      acc[ID].push(Date);
    }
    return acc;
  }, {});
  return result;
};

let memberDates = calculateIDDates();
let attendance = {};

// iterate through each key in the object
Object.keys(memberDates).forEach(function (key) {
  // check if the value of the key is an array
  if (Array.isArray(memberDates[key])) {
    // iterate through each value in the array
    memberDates[key].forEach(function (value) {
      // call your function with the key and the value
      if (validAttendence(key, value)) {
        if (attendance.hasOwnProperty(key)) {
          attendance[key] = parseInt(attendance[key] + 1);
        } else {
          attendance[key] = 1;
        }
      }
    });
  }
});

const resultArr = [];

// iterate through each key in the attendance object
Object.keys(attendance).forEach(function (key) {
  let hit = data.find(function (object) {
    return object.ID == key;
  });
  resultArr.push({ ID: hit.ID, name: hit.Name, Attendence: attendance[key] });
});

// the result array contains objects with ID, name, and attendance fields
resultArr.forEach((each) => {
  fs.appendFile(
    "attendence.txt",
    `ID: ${each.ID} | ${each.name} | Attendence: ${each.Attendence} \n`,
    (err) => {
      if (err) {
        console.log(err);
      } else {
        // Get the file contents after the append operation
        console.log("\nFile Contents of file after append:");
      }
    }
  );
});
