// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise');

cloud.init()

const db = cloud.database();
const URL = 'http://musicapi.xiecheng.live/personalized';
const playlistCollection = db.collection('playlist');
const MAX_LIMIT = 100;

// 云函数入口函数
exports.main = async(event, context) => {
  // const list = await playlistCollection.get() 最多获取100条信息，需进行优化
  // 需要获取数据总条数
  const countResult = await playlistCollection.count();
  const total = countResult.total;
  // 数据获取次数
  const getNumber = Math.ceil(total / MAX_LIMIT);
  // 获取数据的容器
  const getDataList = [];
  // 保存分批次获取的数据
  for (let i = 0; i < getNumber; i++) {
    // skip从指定的值开始返回，limit结果集数量上限
    let promise = playlistCollection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get();
    getDataList.push(promise);
  }

  let list = {
    data: [],
  }

  // 数据赋值给list（合并数组）
  if (getDataList.length > 0) {
    list = (await Promise.all(getDataList)).reduce((accumulator, currentValue) => {
      return {
        data: accumulator.data.concat(currentValue.data),
      }
    });
  }

  // 请求歌单数据
  const playlist = await rp(URL).then((res) => {
    return JSON.parse(res).result;
  })
  // 去重后的歌单
  const newData = [];
  // 数组去重
  for (let i = 0; i < playlist.length; i++) {
    let flag = true;
    for (let j = 0; j < list.data.length; j++) {
      if (playlist[i].id === list.data[j].id) {
        flag = false;
        break;
      }
    }
    if (flag) {
      newData.push(playlist[i]);
    }
  }

  // 插入数据库歌单集合
  for (let i = 0; i < newData.length; i++) {
    await playlistCollection.add({
      data: {
        ...newData[i],
        createTime: db.serverDate(),
      }
    }).then((res) => {
      console.log('插入成功');
    }).catch((err) => {
      console.log('插入失败');
    })
  }

  return newData.length;
}