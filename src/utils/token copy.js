import { SignJWT } from 'jose';
import { isDebugMode } from './keyboard';

export const generateToken = async (group, dashboard) => {
  const secretKey = new TextEncoder().encode(dashboard.key);

  const payload = {
    dataModelFilter: [
      {
        table: "Groups",
        column: "Name",
        datatype: "text",
        members: [group],
      },
    ],
  };

  const header = { alg: 'HS256', typ: 'JWT' };
  const token = await new SignJWT(payload)
    .setProtectedHeader(header)
    .sign(secretKey);

  if (isDebugMode()) {
    console.log("Token:", token);
    console.log("Header:", header);
    console.log("Payload:", JSON.stringify(payload));
    console.log("Key:", dashboard.key);
  }

  return token;
};
