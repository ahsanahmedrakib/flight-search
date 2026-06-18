import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { to, pnr, flight, passengers, contact } = body;

  const passengerRows = passengers
    .map(
      (p: { firstName: string; lastName: string; gender: string; passportNumber?: string }) =>
        `<tr>
          <td style="padding:6px 12px;border-bottom:1px solid #f0f0f0;">${p.firstName} ${p.lastName}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #f0f0f0;text-transform:capitalize;">${p.gender}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #f0f0f0;">${p.passportNumber || "—"}</td>
        </tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;max-width:600px;width:100%;">

        <tr>
          <td style="background:#1e293b;padding:24px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="margin:0;color:#ffffff;font-size:18px;font-weight:900;letter-spacing:1px;">✈️ ${flight.airlineName}</p>
                  <p style="margin:4px 0 0;color:#94a3b8;font-size:12px;">${flight.flightNumber} · ${flight.aircraft}</p>
                </td>
                <td align="right">
                  <p style="margin:0;color:#94a3b8;font-size:10px;text-transform:uppercase;letter-spacing:2px;">PNR</p>
                  <p style="margin:4px 0 0;color:#ffffff;font-size:20px;font-weight:900;letter-spacing:3px;">${pnr}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="background:#ecfdf5;padding:12px 32px;border-bottom:1px solid #d1fae5;">
            <p style="margin:0;color:#065f46;font-size:13px;font-weight:700;">✓ Booking Confirmed — Your e-ticket is ready</p>
          </td>
        </tr>

        <tr>
          <td style="padding:32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="38%" style="vertical-align:top;">
                  <p style="margin:0;color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">${flight.originCity}</p>
                  <p style="margin:4px 0;color:#0f172a;font-size:36px;font-weight:900;line-height:1;">${flight.originCode}</p>
                  <p style="margin:4px 0 0;color:#1e293b;font-size:16px;font-weight:700;">${flight.departureTime}</p>
                  <p style="margin:4px 0 0;color:#94a3b8;font-size:11px;">${flight.originAirport}</p>
                </td>
                <td width="24%" align="center" style="vertical-align:middle;">
                  <p style="margin:0;color:#94a3b8;font-size:10px;font-weight:700;">${flight.stops === 0 ? "Non-stop" : `${flight.stops} Stop`}</p>
                  <p style="margin:8px 0;color:#64748b;font-size:18px;">— ✈ —</p>
                  <p style="margin:0;color:#1e293b;font-size:12px;font-weight:700;">${flight.duration}</p>
                </td>
                <td width="38%" align="right" style="vertical-align:top;">
                  <p style="margin:0;color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">${flight.destinationCity}</p>
                  <p style="margin:4px 0;color:#0f172a;font-size:36px;font-weight:900;line-height:1;">${flight.destinationCode}</p>
                  <p style="margin:4px 0 0;color:#1e293b;font-size:16px;font-weight:700;">${flight.arrivalTime}</p>
                  <p style="margin:4px 0 0;color:#94a3b8;font-size:11px;">${flight.destinationAirport}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr><td style="padding:0 32px;"><hr style="border:none;border-top:1px dashed #e2e8f0;margin:0;" /></td></tr>

        <tr>
          <td style="padding:20px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="33%">
                  <p style="margin:0;color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Date</p>
                  <p style="margin:4px 0 0;color:#0f172a;font-size:13px;font-weight:700;">${flight.date}</p>
                </td>
                <td width="33%">
                  <p style="margin:0;color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Class</p>
                  <p style="margin:4px 0 0;color:#0f172a;font-size:13px;font-weight:700;">${flight.cabinClass}</p>
                </td>
                <td width="33%">
                  <p style="margin:0;color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Baggage</p>
                  <p style="margin:4px 0 0;color:#0f172a;font-size:13px;font-weight:700;">Cabin: ${flight.baggageCabin}</p>
                  <p style="margin:2px 0 0;color:#0f172a;font-size:13px;font-weight:700;">Checked: ${flight.baggageChecked}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr><td style="padding:0 32px;"><hr style="border:none;border-top:1px dashed #e2e8f0;margin:0;" /></td></tr>

        <tr>
          <td style="padding:20px 32px;">
            <p style="margin:0 0 12px;color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Passengers (${passengers.length})</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0f0f0;border-radius:8px;overflow:hidden;">
              <tr style="background:#f8fafc;">
                <th style="padding:8px 12px;text-align:left;font-size:10px;color:#64748b;font-weight:700;text-transform:uppercase;">Name</th>
                <th style="padding:8px 12px;text-align:left;font-size:10px;color:#64748b;font-weight:700;text-transform:uppercase;">Gender</th>
                <th style="padding:8px 12px;text-align:left;font-size:10px;color:#64748b;font-weight:700;text-transform:uppercase;">Passport</th>
              </tr>
              ${passengerRows}
            </table>
          </td>
        </tr>

        <tr><td style="padding:0 32px;"><hr style="border:none;border-top:1px dashed #e2e8f0;margin:0;" /></td></tr>

        <tr>
          <td style="padding:20px 32px;">
            <p style="margin:0 0 8px;color:#94a3b8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Contact</p>
            <p style="margin:0;color:#0f172a;font-size:13px;">📧 ${contact.email}</p>
            <p style="margin:4px 0 0;color:#0f172a;font-size:13px;">📞 ${contact.phone}</p>
          </td>
        </tr>

        <tr>
          <td style="background:#0f172a;padding:16px 32px;text-align:center;">
            <p style="margin:0;color:#ffffff;font-size:10px;letter-spacing:4px;font-family:monospace;">| ||| || ||| | || | |||| || | ||| || || | ||</p>
            <p style="margin:6px 0 0;color:#64748b;font-size:10px;letter-spacing:2px;">${pnr} · BOARDING PASS · MOB-TKT</p>
          </td>
        </tr>

        <tr>
          <td style="padding:16px 32px;text-align:center;">
            <p style="margin:0;color:#94a3b8;font-size:11px;">This is an automated confirmation. Please carry a printed or digital copy at the airport.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    const { error } = await resend.emails.send({
      from: "Flight Booking <onboarding@resend.dev>",
      to,
      subject: `Booking Confirmed — PNR: ${pnr}`,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Mail error:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
