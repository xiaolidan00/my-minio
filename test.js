const MinioUtil = require('./index.js');
const minioConfig = require('./credentials.json');
const file = './images/test.png'; //上传文件地址
const bucketName = 'resources';
const fileName = 'image-test.png'; //上传后的文件名
const filePath = './test11.png'; //下载文件地址
(async function () {
  await MinioUtil.initMinio('127.0.0.1', 9000, false, minioConfig.accessKey, minioConfig.secretKey);
  //   console.log(await MinioUtil.uploadFile(bucketName, fileName, file, 'image/png'));//上传
  //   console.log(await MinioUtil.getTempUrl(bucketName, fileName, 10));//临时访问
  //   await MinioUtil.getFile(bucketName, fileName, filePath);//下载
  //   await MinioUtil.removeFile(bucketName, fileName);//删除单个
  //   await MinioUtil.removeAllFile(bucketName, fileName);//删除该文本全部历史版本
})();
