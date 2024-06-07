// utils/db.js // db와의 연결 로직
import { MongoClient } from 'mongodb'; // 몽고 db 라이브러리를 import

const uri = process.env.MONGODB_URI; // 몽고 디비의 주소를 숨김 파일에 있는 url로 설정

let client; // 클라이언트 변수를 선언
let clientPromise;

if (!process.env.MONGODB_URI) { // 유효하지 않은 url이면
  throw new Error('Please add your Mongo URI to .env.local'); // url을 제대로 추가하라는 에러 메세지 출력
}


// 나머지는 공식 문서에서 하라는대로 했습니다.
if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;

