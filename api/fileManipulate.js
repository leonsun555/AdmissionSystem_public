const compressing = require("compressing");
const express = require("express");

// const filepreview = require('./filePreview/filepreview.js');
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
var bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const ImageModule = require("docxtemplater-image-module");
// const Barc = require('barcode-generator');
// const IMG_WIDTH = 500, IMG_HEIGHT = 50;
const busboy = require("connect-busboy");
const app = express();

var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With, cache-control"
  );
  // intercept OPTIONS method
  if ("OPTIONS" == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
};

app.use(allowCrossDomain);
// function docxInitial() {
//     var opts = {}
//     opts.centered = false;
//     opts.getImage = function (tagValue, tagName) {
//         return fs.readFileSync(tagValue);
//     }

//     opts.getSize = function () {
//         return [IMG_WIDTH, IMG_HEIGHT];
//     }
//     var imageModule = new ImageModule(opts);
//     var docx = new Docxtemplater().attachModule(imageModule);
//     return docx;
// }

//for file upload
app.use(busboy());
// for parsing application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// for parsing application/json
app.use(bodyParser.json());

app.get("/api/compress", (req, res) => {
  compressing.zip
    .compressDir("fileToPrint", "download.zip")
    .then(() => {
      res.set("Content-disposition", "attachment; filename=download.zip");
      res.set("Content-type", "application/zip");
      // console.log('downloading');
      res.download("download.zip", function(err) {
        if (err) {
          res.send(err);
        } else {
          fs.readdir("fileToPrint", (err, files) => {
            if (err) throw err;

            for (const file of files) {
              fs.unlink(path.join("fileToPrint", file), err => {
                if (err) throw err;
              });
            }
          });
        }
      });
    })
    .catch(err => {
      console.error(err);
      res.send({ error: err });
    });
});

app.post("/api/uploadDocx", (req, res, next) => {
  var fstream;
  var fieldOb = {};
  req.pipe(req.busboy);
  req.busboy.on("field", function(fieldname, val) {
    // console.log('fieldName:' + fieldname);
    fieldOb[fieldname] = val;
    // console.log('val:' + fieldOb[fieldname]);
  });
  req.busboy.on("file", async function(fieldname, file, filename) {
    // console.log("Uploading: " + filename);
    // console.log("admissionPath" + req.body.admissionPath );
    // console.log("department" + req.body.department);
    //Path where image will be uploaded
    await fieldOb;
    // console.log(fieldOb);
    // console.log('subject:' + fieldOb.subject);
    // console.log('path:' + fieldOb.admissionPath);
    // console.log('dep:' + fieldOb.department);
    if (fieldOb.subject !== ""){
      fstream = fs.createWriteStream(
        "docTemplate/" +
          fieldOb.admissionPath +
          "/" +
          fieldOb.department +
          "/" +
          fieldOb.subject +
          ".docx"
      );
    }
    else
      fstream = fs.createWriteStream(
        "docTemplate/" +
          fieldOb.admissionPath +
          "/" +
          fieldOb.department +
          "/" +
          fieldOb.department +
          ".docx"
      );
    file.pipe(fstream);
    fstream.on("close", function() {
      // console.log("Upload Finished of " + filename);
      res.send(JSON.stringify({ success: "Upload success!" })); //where to go next
      //next();
    });
  });
});
app.post("/api/writeFile", (req, res, next) => {
  var data = req.body;
  var currentID,
    currentNum,
    hasNext = "";
  var dataSet = {},
    fileName;
  //將第一筆資料的路徑參數撈出
  var admissionType = data[0].招生別.trim(),
    admissionDept = data[0].系所.trim(),
    isContin = data[0].是否連續.trim();
  //將 面試(xxx) 科目代碼取出
  var subject = data[0].科目代碼.trim()
  // switch (subject) {
  //   case "小提琴":
  //     subject = "絃樂";
  //     break;
  //   case "中提琴":
  //     subject = "絃樂";
  //     break;
  //   case "大提琴":
  //     subject = "絃樂";
  //     break;
  //   case "低音提琴":
  //     subject = "絃樂";
  //     break;
  //   case "豎琴":
  //     subject = "絃樂";
  //     break;
  //   default:
  //     break;
  // }

  // //因為管樂部分的科目名稱與其他科目不同,故使用regex判斷
  // switch (true) {
  //   case /管樂木管類/.test(subject):
  //     subject = "管樂";
  //     break;
  //   case /管樂銅管類/.test(subject):
  //     subject = "管樂";
  //     break;
  // }

  switch (admissionDept) {
    case "電影創作學系(甲)":
      admissionDept = "電影創作學系";
      break;
    case "電影創作學系(乙)":
      admissionDept = "電影創作學系";
      break;
    default:
      break;
  }

  // console.log(admissionType);
  // console.log(admissionDept);
  // console.log(subject);
  try {
    if (
      (admissionType === "特殊選才")
    ) {
      var content = fs.readFileSync(
        "docTemplate/" +
          admissionType +
          "/" +
          admissionDept +
          "/" +
          admissionDept +
          ".docx",
        "binary"
      );
    } else {
      var content = fs.readFileSync(
        "docTemplate/" +
          admissionType +
          "/" +
          admissionDept +
          "/" +
          subject +
          ".docx",
        "binary"
      );
    }
  } catch (err) {
    res.send(JSON.stringify({ error: err.message }));
    //next();
  }
  // console.log('test1');
  // var barc = new Barc();
  // var buf = barc.code128(data[0]['條碼編號'], IMG_WIDTH, IMG_HEIGHT);
  // fs.writeFileSync(__dirname + '/barcode/' + data[0]['條碼編號'] + '.png', buf, function(){
  //     console.log('wrote it');
  // });
  // var doc = docxInitial();
  var doc = new Docxtemplater();
  var zip = new PizZip(content);
  doc.loadZip(zip);
  data.forEach(function(element, i) {
    //准考證號
    var currentID = "ID" + (i + 1);
    //排考序號
    currentNum = "c" + (i + 1);
    var hN = "N" + (i + 1);
    fileName =
      admissionDept +
      "_" +
      element["科目名稱"] +
      "_" +
      element["頁次"] +
      ".docx";
    dataSet[currentID] = element["准考證號"];
    dataSet["年度"] = element["年度"];
    dataSet["招生別"] = element["招生別"];
    dataSet["系所"] = admissionDept;
    dataSet["科目名稱"] = element["科目名稱"];
    if (isContin === "不連續") {
      dataSet[currentNum] = element["序號"];
    } else {
      dataSet[currentNum] = element["連續序號"];
    }
    // dataSet[currentNum] = element['連續序號'];
    dataSet["教師編號"] = element["教師編號"];
    // dataSet['barcode'] = __dirname + '/barcode/' + element['條碼編號'] + '.png';
    dataSet["頁次"] = element["列印頁次"];
    dataSet["節次"] = element["節次"];
    dataSet[hN] = element["hN"];

    // console.log(dataSet);

    //set the templateVariables
    doc.setData(dataSet);
    // console.log(element['科目名稱']);
    // console.log(element['頁次']);
    try {
      // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
      doc.render();
      // console.log('test5');
    } catch (error) {
      // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object).
      var err = {
        message: error.message,
        name: error.name,
        stack: error.stack,
        properties: error.properties
      };
      console.log(JSON.stringify({ error: err }));
      if (error.properties && error.properties.errors instanceof Array) {
        const errorMessages = error.properties.errors
          .map(function(error) {
            return error.properties.explanation;
          })
          .join("\n");
        console.log("errorMessages", errorMessages);
        // errorMessages is a humanly readable message looking like this :
        // 'The tag beginning with "foobar" is unopened'
        res.send(JSON.stringify({ error: err.message }));
      }
      // throw error;
      //next();
    }
  });
  var buf = doc.getZip().generate({ type: "nodebuffer" });
  // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
  fs.writeFileSync("fileToPrint/" + fileName, buf);
  //產生docx預覽圖片(暫時放棄)
  // var fileNamePrefix = fileName.split('.')[0];
  // filepreview.generate('fileToPrint/' + fileName, 'assets/img/printPreview/' + fileNamePrefix + '.gif', function (error) {
  //     if (error) {
  //         //   return console.log(error);
  //         console.log(error);
  //         res.send(error);
  //     }
  //     // console.log('File preview is /home/myfile_preview.gif');
  // });
  // res.json({data: fileNamePrefix});
  //next();
  res.json({ success: "success!" });
});

app.listen(3356, function() {
  console.log("fileManipulate is running at port 3356!");
});
// module.exports = {
//     path: '/api',
//     handler: app
// }
