function convertToBase64(blob) {
  return `data:${blob.getContentType()};base64,${Utilities.base64Encode(blob.getBytes())}`;
}

function sendTicket(eve, event_name, participant_names, participant_email, participant_team, ticket_id) {

  // Access the images
  const event_img = DriveApp.getFileById(eve.image);
  const logo_img = DriveApp.getFileById(LOGO);

  // Debug
  console.log(event_img.getName());
  console.log(logo_img.getName());

  // Get QRCODE using qrserver.com
  const qr_addr = encodeURI(QR_API + '?data=' + event_name.toUpperCase() + '\n' + (participant_team || '') + '\n' + ticket_id + '\n' + participant_names.join('\n') + '\n' + participant_email);
  const qr_img = UrlFetchApp.fetch(qr_addr);

  // Debug
  console.log(qr_img);

  // HTML templates
  const html_template = HtmlService.createTemplateFromFile('ticket_template.html');

  html_template.event_image = convertToBase64(event_img.getBlob());
  html_template.logo_image = convertToBase64(logo_img.getBlob());
  html_template.qrcode_image = convertToBase64(qr_img.getBlob());

  html_template.day_of_week = eve.day_of_week;
  html_template.date = eve.date;
  html_template.event_name = eve.event_name.toUpperCase();
  html_template.team_name = participant_team;
  html_template.start_time = eve.start_time;
  html_template.end_time = eve.end_time;
  html_template.participant_names = participant_names;
  html_template.ticket_id = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.MD2, event_name+' : '+ticket_id)).substring(0, 8)+ticket_id;

  // Blobert is the pdf, that we send to the dudes
  const blobert = html_template.evaluate().getAs('application/pdf');
  blobert.setName('ticket.pdf');

  // If we have juice left we send it otherwise we quit out.
  if(MailApp.getRemainingDailyQuota() > 0) {
    MailApp.sendEmail({
      to: participant_email,
      subject: 'eXabyte-2026 Registration Confirmation for ' + event_name,
      body: `Registration Confirmation.
      
Carry Either A Soft Or Hard Copy Of This Ticket To eXabyte'26. One Ticket Allows You to Enter Only One Event. For Entering Other Events Please Register For Them Separately And You Will Get A Unique Ticket For Every Event You Register For.

See You At eXabyte'26!`,
      attachments: [blobert],
    });
  }
  else {
    throw new Error('Ran Out of Mailing Quota: Resend Later');
  }
}

function main(e) {
  try {
    const event_name = e.range.getSheet().getName().toLowerCase();
    const eve = EVENTS[event_name];

    // Get the Participant Names
    let participant_names = [];
    for(let i = 0; i < eve.names.length; i++)
      participant_names.push(e.namedValues[eve.names[i]][0]);

    // Get Email Address
    let participant_email = e.namedValues['Email address'][0];

    // Get Team Name, '' if nothingburger
    let participant_team = e.namedValues[eve.team_name];

    // Get ticket id
    let ticket_id = e.range.getRow();
    console.log(participant_names, participant_email, participant_team, ticket_id);

    sendTicket(eve, event_name, participant_names, participant_email, participant_team, ticket_id);
  }
  catch(err) {
    let rows = [e.range.getSheet().getName(), err.message].concat(e.values);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Errors');
    sheet.appendRow(rows);
  }
}
