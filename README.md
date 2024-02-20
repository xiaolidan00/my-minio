---
highlight: vs
theme: fancy
---

对象存储怎么少得了 MinIO，是时候给 Node 后台添加 MinIO，让文件操作强大起来，啊哈哈哈(≧ω≦)

# 安装配置 MinIO

## 1. 下载 MinIO 服务

官方下载地址：[https://min.io/download]

window 的这里=》：https://dl.min.io/server/minio/release/windows-amd64/minio.exe

## 2. 启动 MinIO 服务

cmd 中执行命令

```bash
minio.exe server D:\code\my-minio\minio-data --console-address ":9001"
```

**注意：** D:\code\my-minio\minio-data 替换成你的 minio 数据的文件夹

我的文件目录是这样的，可以参考一下

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/921ca7c2d62142b0ab507edc8cb5f812~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=270&h=159&s=5484&e=png&b=fefefe)

- 然后你会看到这样的启动信息

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/260a794c6ff44d0fa8ecda3d5b582ca1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=682&h=325&s=26309&e=png&b=0c0c0c)

1. minio API 访问地址：http://127.0.0.1:9000
2. minio 控制台地址： http://localhost:9001
3. 默认控制台账号密码：

- RootUser: minioadmin
- RootPass: minioadmin

开搞，打开控制台地址，输入账号密码：minioadmin，进入管理页面

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3068fbe0f6be48a9b1fdab59ff3c38b2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=919&s=890130&e=png&b=020c25)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/04d90a2d5e084e2893d7f6e0fcbb6133~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=919&s=235707&e=png&b=ffffff)

## 3. 创建 Access Keys

- 点击右上角的按钮

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f6bd8f9cf0f54fdea4be3c0b08089e55~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=919&s=246904&e=png&b=fefefe)

- 然后就会出现创建界面

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/797a9f094de14c94ae87d6ff1bd3dcbb~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=919&s=339914&e=png&b=ffffff)

- minio 会自动生成 accessKey 和 secretKey,像我这么懒的人当然就是什么配置都不动，直接点确认.如果想改成自己想要的字符串也行。

- 这个时候弹出个对话框，可以下载和复制，我这么懒，当然是直接将 credentials.json 下载到本地
  ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d9f306cbab94db79926ac03346c0c76~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1256&h=849&s=145536&e=png&b=c3c3c3)

- 打开一看，有这样的信息，留着等一下对接 js 用

```json
{
  "url": "http://localhost:9001/api/v1/service-account-credentials",
  "accessKey": "O3UKQM4t5dDKJR7SsT1Q",
  "secretKey": "3mllG17sXFP866iq4DafwxGnCSgXKIGT5w35FFXc",
  "api": "s3v4",
  "path": "auto"
}
```

## 4. 配置 Buckets

- 点击右上角创建 Bucket

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af4c9922d85343ca86ae4611b42bfc2a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=919&s=242983&e=png&b=fefefe)

- 输入 bucket 名称 resources(爱叫什么都行，我这里示例而已)，直接确定

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/952b517ea2054c599fb5f9aaa79dd6c5~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=919&s=299950&e=png&b=fefefe)

- 然后你就可以看到 minio 数据的文件夹里面就多了个 resources

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/01daaf00b009412ab134e6a29b866144~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=231&h=130&s=3649&e=png&b=fefefe)

# JS 接入

官网 JS 接入地址：https://min.io/docs/minio/linux/developers/javascript/minio-javascript.html

## 1. 安装 minio，js 客户端

```bash
npm install --save minio
```

## 2. 创建 minio 客户端

```js
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
```

## 3. 上传个文件

```js
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
```

文件将上传到 minio 数据的文件夹 resources/image-test.png

```js
//objInfo
{
  etag: '4ae15d293a07312b36f657b4fc679266',
  versionId: 'c6e05d0c-1851-4977-ab83-736784a58338'
    }
```

**objInfo**：etag 用于协商缓存的，有需要的话存一下。versionId 要在 bucket 配置 Current Status 开启才能用，可以实现历史版本文件。

- 点开 Object Browser 对象浏览器的时候发现文件就在那里
  ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ced7690124ee4dc3bbf8d3b69b4485e7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=919&s=260158&e=png&b=ffffff)
- 点击文件可以进行一些操作

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a7e46a4354b43cdb2d925484be50aab~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=919&s=289481&e=png&b=fefefe)

**开启对象历史版本**

- 打开文件夹配置，然后编辑 Current Status，将弹框的 Versioning Status 勾选可用，然后就可以了
  ![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd5dcfd9c49b4f8f93eaa552fbcf687f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=816&h=647&s=36276&e=png&b=fdfdfd)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e759426834da453285516406e9c5ec7a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=813&h=470&s=42306&e=png&b=f3f3f3)

- 当你重复几次上传文件为同一个文件名的时候，就是该文件的不同历史版本。可以打开 Object Browser 对象浏览器的 Object Versions 查看

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7b5270a09934ad5b640327725615392~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=919&s=334252&e=png&b=fdfdfd)

## 4. 访问文件

- 你打算使用文件地址`http://localhost:9000/resources/image-test.png`去访问的时候发现失败了

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e00a9fe0d96d4820b30d2d04b933a509~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=883&h=250&s=26029&e=png&b=ffffff)

**开放访问权限**

1. 点开 bucket 的 resources 文件夹配置 Anonymous 匿名访问

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba4794f147a74affa317e23237fed8e4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=919&s=259648&e=png&b=fdfdfd) 2. 添加一个访问设置，prefix 为`/`（斜杆，意思是当前文件夹下的所有文件，如果要特定开放某个子目录就写对应文件夹名称），访问权限为 readonly。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7967377b508f4403ae64b57538671d7a~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=948&h=511&s=39319&e=png&b=cdcdcd)

然后那个文件地址就能可以访问到了！

注意：

- 这样开放文件夹访问权限是永久的。并且图片链接开启了协商缓存，第二次访问若未修改直接读取浏览器缓存。

- 默认访问的就是最新的文件，即便开启历史版本，只会显示最新。

- 如果需要访问特定版本文件，要加上 versionId,比如 http://localhost:9000/resources/image-test.png?versionId=2f71c0dc-4dee-463a-9510-12f8c9c0e652

**如果不想文件公开访问，可以创建临时访问链接**

```js
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
```

返回一个临时链接，在有效时间内可以访问，过了时效就访问失败了。

```txt
http://127.0.0.1:9000/resources/image-test.png?versionId=2f71c0dc-4dee-463a-9510-12f8c9c0e652&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=O3UKQM4t5dDKJR7SsT1Q%2F20240220%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240220T134902Z&X-Amz-Expires=1000&X-Amz-SignedHeaders=host&X-Amz-Signature=3b2898cbfdcf5426d07859c82ab94186133bd18b8ad840c70e7b111b7da21b59
```

## 5. 下载文件

```js
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
        resolve();
      }
    );
  });
}
```

## 6. 删除文件

```js
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
        resolve();
      });
  });
}
```

- 如果有历史版本，但删除的时候没有指定版本，默认会删除掉最新的版本，历史版本还是可以访问的。
- 在 Object Browser 对象浏览器里面默认显示当前状态最新的文件，此时删除文件看不见，勾选 show deleted objects 就可以看到了。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb4d27f6c4b242a68c529487ecbb187c~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1661&h=515&s=56307&e=png&b=fefefe)

- 查看该删除文件历史记录可以看到最新版本已经被删除，但历史版本还在。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71e9e69dae584606ba45255e32970f2d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1628&h=787&s=115204&e=png&b=fdfdfd)

- 已删除的某个版本文件虽然记录还在，却不可进行操作了。

**彻底删除文件以及其历史版本**

```js
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
        resolve();
      });
    });
    stream.on('error', function (err) {
      // console.log(err);
      reject(err);
    });
  });
}
```

# 总结

Minio 配置很方便，功能真的好强大。还有很多惊喜操作可以看[官方文档](https://min.io/)！我这个人懒，就不写了。

官方 JS API 文档：https://min.io/docs/minio/linux/developers/javascript/API.html

# Github 地址

https://github.com/xiaolidan00/my-minio
