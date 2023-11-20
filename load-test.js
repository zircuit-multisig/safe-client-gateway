import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 50,
  duration: '15s',
};

export default function () {
  let res = http.get(
    'http://localhost:3000/v1/chains/1/safes/0x1f9090aaE28b8a3dCeaDf281B0F12828e676c326/emails',
  );

  check(res, { 'success login': (r) => r.status === 200 });

  sleep(0.3);
}
