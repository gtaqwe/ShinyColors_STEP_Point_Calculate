const REQUIRED_POINT = {
  0: [10, 0],
  1: [15, 0],
  2: [20, 1],
  3: [30, 2],
  4: [40, 3],
  5: [50, 4],
};

const POINT_PROPERTY = {
  Vocal: { PointId: "VocalProwess", PointName_ko: "가창력" },
  Dance: { PointId: "Stability", PointName_ko: "안정감" },
  Visual: { PointId: "Expressiveness", PointName_ko: "표현력" },
  Mental: { PointId: "Focus", PointName_ko: "집중력" },
  Sp: { PointId: "Teamwork", PointName_ko: "단결력" },
};

const INPUT_LIST = {
  0: { id: "VocalStatus", type: "Vocal" },
  1: { id: "VocalMaximum", type: "Vocal" },
  2: { id: "DanceStatus", type: "Dance" },
  3: { id: "DanceMaximum", type: "Dance" },
  4: { id: "VisualStatus", type: "Visual" },
  5: { id: "VisualMaximum", type: "Visual" },
  6: { id: "MentalStatus", type: "Mental" },
  7: { id: "MentalMaximum", type: "Mental" },
  8: { id: "SpStatus1", type: "Sp1" },
  9: { id: "SpStatus2", type: "Sp2" },
};

init();

function init() {
  for (let i = 0; i < Object.keys(INPUT_LIST).length; i++) {
    setValidData(INPUT_LIST[i].id);

    createSpendPointTable(
      INPUT_LIST[i].id,
      INPUT_LIST[i].type,
      $(`#Expect${INPUT_LIST[i].id}`).val()
    );
    createSpendPointTable(INPUT_LIST[i].id, INPUT_LIST[i].type, $(`#Now${INPUT_LIST[i].id}`).val());
  }

  calculateResultPoint();
  calculateResultStat();
}

function modifySpendPoint(inputName, statType, currnetCount) {
  setValidData(inputName);
  createSpendPointTable(inputName, statType, currnetCount);
  calculateResultPoint();
  calculateResultStat();
}

function setValidData(inputName) {
  const expectVal = Number($(`#Expect${inputName}`).val());
  const expectMinVal = Number($(`#Expect${inputName}`).attr("min"));
  const expectMaxVal = Number($(`#Expect${inputName}`).attr("max"));

  if (expectVal < expectMinVal) {
    $(`#Expect${inputName}`).val(expectMinVal);
  }

  if (expectVal > expectMaxVal) {
    $(`#Expect${inputName}`).val(expectMaxVal);
  }

  const nowVal = Number($(`#Now${inputName}`).val());
  const nowMinVal = Number($(`#Now${inputName}`).attr("min"));
  const nowMaxVal = Number($(`#Now${inputName}`).attr("max"));

  if (nowVal < nowMinVal) {
    $(`#Now${inputName}`).val(nowMinVal);
  }

  if (nowVal > nowMaxVal) {
    $(`#Now${inputName}`).val(nowMaxVal);
  }

  if (nowVal > expectVal) {
    $(`#Now${inputName}`).val(expectVal);
  }
}

function createSpendPointTable(inputName, statType, currnetCount) {
  let divId = inputName + "Point";
  if ($(`#showUpPointCheck`).prop("checked") == false) {
    $(`#${divId}`).html("");
    return;
  }

  let pointTableId = inputName + "Table";
  let table = `<table id="${pointTableId}">`;

  table += "<thead>";
  table += `<tr>`;

  table += createPointTableHeader();

  table += "</tr>";
  table += "</thead>";
  table += "<tbody>";

  table += `<tr>`;

  table += setPointTable(statType, currnetCount);

  table += "</tr>";

  table += "</tbody>";
  table += "</table>";

  $(`#${divId}`).html(table);
}

function createPointTableHeader() {
  let th = "";

  Object.values(POINT_PROPERTY).forEach((v) => {
    th += `<th>${v.PointName_ko}</th>`;
  });

  return th;
}

function setPointTable(status, currentCount) {
  let td = "";
  let requiredPoint = getStatusPointByCurrentCount(currentCount);
  let pointArray = [0, 0, 0, 0, 0];
  if (status == "Vocal") {
    pointArray[0] = requiredPoint[0];
    pointArray[4] = requiredPoint[1];
  } else if (status == "Dance") {
    pointArray[1] = requiredPoint[0];
    pointArray[4] = requiredPoint[1];
  } else if (status == "Visual") {
    pointArray[2] = requiredPoint[0];
    pointArray[4] = requiredPoint[1];
  } else if (status == "Mental") {
    pointArray[3] = requiredPoint[0];
    pointArray[4] = requiredPoint[1];
  } else if (status == "Sp1") {
    pointArray[4] = 30;
  } else if (status == "Sp2") {
    pointArray[0] = 20;
    pointArray[1] = 20;
    pointArray[2] = 20;
    pointArray[3] = 20;
  }

  Object.values(POINT_PROPERTY).forEach((v, idx) => {
    td += `<td>${pointArray[idx]}</td>`;
  });

  return td;
}

function getStatusPointByCurrentCount(currentCount) {
  if (currentCount < 31) {
    return REQUIRED_POINT[0];
  } else if (currentCount < 61) {
    return REQUIRED_POINT[1];
  } else if (currentCount < 91) {
    return REQUIRED_POINT[2];
  } else if (currentCount < 121) {
    return REQUIRED_POINT[3];
  } else if (currentCount < 151) {
    return REQUIRED_POINT[4];
  } else {
    return REQUIRED_POINT[5];
  }
}

function calculateResultPoint() {
  let pointRes;
  let table = `<table id="ResultSpendPointTable">`;

  table += "<thead>";
  table += `<tr>`;

  table += createPointTableHeader();

  table += "</tr>";
  table += "</thead>";
  table += "<tbody>";

  table += `<tr>`;

  pointRes = calculatePoint();
  for (let i = 0; i < pointRes.length; i++) {
    table += `<td>${pointRes[i]}</td>`;
  }

  table += "</tr>";

  table += "</tbody>";
  table += "</table>";

  $(`#ResultSpendPoint`).html(table);
}

function calculatePoint() {
  let totalPointlist = [0, 0, 0, 0, 0];
  let pointResult;
  let statusId;

  // Vocal
  statusId = "VocalStatus";
  pointResult = calculateUpCount(Number($(`#Expect${statusId}`).val()));
  totalPointlist[0] += pointResult[0];
  totalPointlist[4] += pointResult[1];
  pointResult = calculateUpCount(Number($(`#Now${statusId}`).val()));
  totalPointlist[0] -= pointResult[0];
  totalPointlist[4] -= pointResult[1];

  statusId = "VocalMaximum";
  pointResult = calculateUpCount(Number($(`#Expect${statusId}`).val()));
  totalPointlist[0] += pointResult[0];
  totalPointlist[4] += pointResult[1];
  pointResult = calculateUpCount(Number($(`#Now${statusId}`).val()));
  totalPointlist[0] -= pointResult[0];
  totalPointlist[4] -= pointResult[1];

  // Dance
  statusId = "DanceStatus";
  pointResult = calculateUpCount(Number($(`#Expect${statusId}`).val()));
  totalPointlist[1] += pointResult[0];
  totalPointlist[4] += pointResult[1];
  pointResult = calculateUpCount(Number($(`#Now${statusId}`).val()));
  totalPointlist[1] -= pointResult[0];
  totalPointlist[4] -= pointResult[1];

  statusId = "DanceMaximum";
  pointResult = calculateUpCount(Number($(`#Expect${statusId}`).val()));
  totalPointlist[1] += pointResult[0];
  totalPointlist[4] += pointResult[1];
  pointResult = calculateUpCount(Number($(`#Now${statusId}`).val()));
  totalPointlist[1] -= pointResult[0];
  totalPointlist[4] -= pointResult[1];

  // Visual
  statusId = "VisualStatus";
  pointResult = calculateUpCount(Number($(`#Expect${statusId}`).val()));
  totalPointlist[2] += pointResult[0];
  totalPointlist[4] += pointResult[1];
  pointResult = calculateUpCount(Number($(`#Now${statusId}`).val()));
  totalPointlist[2] -= pointResult[0];
  totalPointlist[4] -= pointResult[1];

  statusId = "VisualMaximum";
  pointResult = calculateUpCount(Number($(`#Expect${statusId}`).val()));
  totalPointlist[2] += pointResult[0];
  totalPointlist[4] += pointResult[1];
  pointResult = calculateUpCount(Number($(`#Now${statusId}`).val()));
  totalPointlist[2] -= pointResult[0];
  totalPointlist[4] -= pointResult[1];

  // Mental
  statusId = "MentalStatus";
  pointResult = calculateUpCount(Number($(`#Expect${statusId}`).val()));
  totalPointlist[3] += pointResult[0];
  totalPointlist[4] += pointResult[1];
  pointResult = calculateUpCount(Number($(`#Now${statusId}`).val()));
  totalPointlist[3] -= pointResult[0];
  totalPointlist[4] -= pointResult[1];

  statusId = "MentalMaximum";
  pointResult = calculateUpCount(Number($(`#Expect${statusId}`).val()));
  totalPointlist[3] += pointResult[0];
  totalPointlist[4] += pointResult[1];
  pointResult = calculateUpCount(Number($(`#Now${statusId}`).val()));
  totalPointlist[3] -= pointResult[0];
  totalPointlist[4] -= pointResult[1];

  // SP
  statusId = "SpStatus1";
  pointResult = Number($(`#Expect${statusId}`).val()) * 30;
  totalPointlist[4] += pointResult;
  pointResult = Number($(`#Now${statusId}`).val()) * 30;
  totalPointlist[4] -= pointResult;

  statusId = "SpStatus2";
  pointResult = Number($(`#Expect${statusId}`).val()) * 20;
  totalPointlist[0] += pointResult;
  totalPointlist[1] += pointResult;
  totalPointlist[2] += pointResult;
  totalPointlist[3] += pointResult;
  pointResult = Number($(`#Now${statusId}`).val()) * 20;
  totalPointlist[0] -= pointResult;
  totalPointlist[1] -= pointResult;
  totalPointlist[2] -= pointResult;
  totalPointlist[3] -= pointResult;

  return totalPointlist;
}

function calculateUpCount(upCount) {
  let countList = [0, 0, 0, 0, 0, 0];
  let pointResult = [0, 0];

  if (upCount <= 30) {
    countList[0] = upCount;
  } else if (upCount <= 60) {
    countList[0] = 30;
    countList[1] = upCount - 30;
  } else if (upCount <= 90) {
    countList[0] = 30;
    countList[1] = 30;
    countList[2] = upCount - 60;
  } else if (upCount <= 120) {
    tempCount = upCount;
    countList[0] = 30;
    countList[1] = 30;
    countList[2] = 30;
    countList[3] = upCount - 90;
  } else if (upCount <= 150) {
    countList[0] = 30;
    countList[1] = 30;
    countList[2] = 30;
    countList[3] = 30;
    countList[4] = upCount - 120;
  } else {
    countList[0] = 30;
    countList[1] = 30;
    countList[2] = 30;
    countList[3] = 30;
    countList[4] = 30;
    countList[5] = upCount - 150;
  }

  for (let i = 0; i < countList.length; i++) {
    pointResult[0] += countList[i] * REQUIRED_POINT[i][0];
    pointResult[1] += countList[i] * REQUIRED_POINT[i][1];
  }

  return pointResult;
}

function calculateResultStat() {
  let table = `<table id="ResultSpendStatTable" style="width:50%">`;

  table += "<thead>";
  table += `<tr>`;

  table += `<th style="vertical-align: text-top">Vocal</th>`;
  table += `<th style="vertical-align: text-top">Vocal<br>상한</th>`;
  table += `<th style="vertical-align: text-top">Dance</th>`;
  table += `<th style="vertical-align: text-top">Dance<br>상한</th>`;
  table += `<th style="vertical-align: text-top">Visual</th>`;
  table += `<th style="vertical-align: text-top">Visual<br>상한</th>`;
  table += `<th style="vertical-align: text-top">Mental</th>`;
  table += `<th style="vertical-align: text-top">Mental<br>상한</th>`;
  table += `<th style="vertical-align: text-top">SP</th>`;

  table += "</tr>";
  table += "</thead>";
  table += "<tbody>";

  table += `<tr>`;

  let indexCount = 0;
  for (let i = 0; i < Object.keys(INPUT_LIST).length - 2; i++, indexCount++) {
    let resVal =
      (Number($(`#Expect${INPUT_LIST[i].id}`).val()) - Number($(`#Now${INPUT_LIST[i].id}`).val())) *
      10;
    table += `<td>${resVal}</td>`;
  }

  let spRes =
    Number($(`#Expect${INPUT_LIST[indexCount].id}`).val()) +
    Number($(`#Expect${INPUT_LIST[indexCount + 1].id}`).val()) -
    (Number($(`#Now${INPUT_LIST[indexCount].id}`).val()) +
      Number($(`#Now${INPUT_LIST[indexCount + 1].id}`).val()));

  table += `<td> ${spRes * 10}</td>`;

  table += "</tr>";

  table += "</tbody>";
  table += "</table>";

  $(`#ResultStat`).html(table);
}
