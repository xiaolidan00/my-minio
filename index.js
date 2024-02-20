const Minio = require('minio');
let minioClient;
function initMinio(host, port, useSSL = false, accessKey, secretKey, option = {}) {
  minioClient = new Minio.Client({
    endPoint: host, //主机域名或ip地址
    port: port, //端口
    useSSL: useSSL, //需要https访问就开启true，像我这样懒的就不开了
    //配置accessKey secretKey
    accessKey: accessKey,
    secretKey: secretKey,
    ...(option || {})
  });
}

function uploadFile(bucketName, fileName, file, type) {
  return new Promise((resolve, reject) => {
    //设置文件类型
    const metaData = {
      // 'Content-Type': 'application/octet-stream'//二进制文件
      // 'Content-Type': 'image/png' //图片
      'Content-Type': type
    };

    minioClient.fPutObject(bucketName, fileName, file, metaData, function (err, objInfo) {
      if (err) return reject(err);
      resolve(objInfo);
    });
  });
}
//下载文件
function getFile(bucketName, fileName, filePath, versionId) {
  return new Promise((resolve, reject) => {
    minioClient.fGetObject(
      bucketName,
      fileName,
      filePath,
      versionId ? { versionId: versionId } : {}, //如果没有开启历史版本，这行可以去掉，默认就是最新文件
      function (err) {
        if (err) {
          return reject(err);
        }
        console.log('getFile ok');
        resolve();
      }
    );
  });
}

function getTempUrl(bucketName, fileName, seconds, versionId) {
  return new Promise((resolve, reject) => {
    minioClient.presignedUrl(
      'GET',
      bucketName,
      fileName,
      seconds,
      versionId ? { versionId: versionId } : {}, //如果没有开启历史版本，这行可以去掉，默认就是最新文件
      function (err, presignedUrl) {
        if (err) return reject(err);
        resolve(presignedUrl);
      }
    );
  });
}
//删除文件
function removeFile(bucketName, fileName, versionId) {
  return new Promise((resolve, reject) => {
    minioClient
      .removeObject(
        bucketName,
        fileName,
        versionId ? { versionId: versionId } : {} //如果没有开启历史版本，这行可以去掉，默认就是最新文件
      )
      .then((err) => {
        if (err) {
          reject(err);
          return;
        }
        console.log('removeFile ok');
        resolve();
      });
  });
}
//彻底删除文件以及其历史版本
function removeAllFile(bucketName, fileName) {
  return new Promise((resolve, reject) => {
    //查找所有版本的文件
    const stream = minioClient.listObjects(
      bucketName,
      fileName,
      true, //找子目录
      { IncludeVersion: true } //包含历史版本
    );
    const files = [];
    stream.on('data', function (obj) {
      //查找到对应数据
      files.push(obj);
    });
    stream.on('end', function (obj) {
      //查找结束
      // console.log(files);
      //批量删除所有文件
      minioClient.removeObjects(bucketName, files, function (e) {
        if (e) {
          return reject(e);
        }
        console.log('removeAllFile ok');
        resolve();
      });
    });
    stream.on('error', function (err) {
      // console.log(err);
      reject(err);
    });
  });
}

module.exports = {
  initMinio,
  getFile,
  removeAllFile,
  removeFile,
  uploadFile,
  getTempUrl
};
