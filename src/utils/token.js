import { SignJWT } from 'jose';
import { isDebugMode } from './keyboard';

export const generateToken = async (members, dashboard) => {
  const secretKey = new TextEncoder().encode(dashboard.key);

  // Controleer of het geselecteerde dashboard het specifieke LTI-dashboard is
  const isLTIDashboard = dashboard.LTI;

  // Bouw de payload afhankelijk van het dashboard
  const payload = isLTIDashboard
    ? {
        dataModelFilter: [
          {
            table: "xapi_actors",
            column: "actor_email",
            datatype: "text",
            members: members.map(email => email.trim()),  // Voeg alle participants toe in één members-array en zorg ervoor dat ze beginnen met 'mailto:'
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
