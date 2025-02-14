import { SignJWT } from 'jose';
import { isDebugMode } from './keyboard';

export const generateToken = async (members, dashboard) => {
  const secretKey = new TextEncoder().encode(dashboard.key);

  // Controleer of het geselecteerde dashboard het specifieke NVWA-dashboard is
  const isNvwaDashboard = dashboard.name.includes('NVWA');

  // Bouw de payload afhankelijk van het dashboard
  const payload = isNvwaDashboard
    ? {
        dataModelFilter: [
          {
            table: "xapi_personas",
            column: "persona_name",
            datatype: "text",
            members: members,  // Voeg alle participants toe in één members-array
          },
        ],
      }
    : {
        dataModelFilter: [
          {
            table: "Groups",
            column: "Name",
            datatype: "text",
            members: [members],  // Voor andere dashboards, verwerk members als een enkele groep
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
