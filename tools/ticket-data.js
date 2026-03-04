// QR Api
const QR_API = 'https://api.qrserver.com/v1/create-qr-code/'

// Pictures
const LOGO = "1x15m4kq6M_VYCmWM7EWJ3HNbvt4DbDm8"; // Logo of eXabyte

const IMG_DEFAULT             = "1igV6pH8WMq5BE25gIudq8WSzoJ1olED1";
const IMG_DIGIBIT             = "1zbVbLo9kDbvrvNnSEBhmfcdH7FM3Mgir";
const IMG_SUDO_X              = "1VhWdmCTmwsa_BK_l0kv8q35YnOc3Hw4Z";
const IMG_CRYPT_X             = "1TD6hXBq-5tZVg17m44wDXjmDXZbvQZSD";
const IMG_WEBBED              = "1Qp5hE-CC43k9eqfVbt69AqTdujW9RpG5";
const IMG_SNAPPIT             = "17zRlHyFFJBNHQmFiSCf5q7mXyLyOS0AV";
const IMG_EMBLEED             = "1Gf_xMlGl3LVXmBFNRSgMYcqjWEYrLR2D";
const IMG_BYTE_TALES          = "1KjD-wkzY4ZQqpTcxNxiz1F06b7uGE_JV";
const IMG_X_HUNT              = "1tDG8rY5neaQj5she565IbI5n5KHYc47y";
const IMG_VERB_O_WAR          = "1x01kW87_Pk1dLxYqMDha2-jVGwtyTMan";
const IMG_CHEXMATE            = "1W3THyuRJ5ITybBeATT49WygToR2CmhBL";
const IMG_CODEPLAY            = "1xfh7w_fMSn7GvR-jNA07ebotYyCvqguu";
const IMG_BRAINSTORM          = "1PYQDKB3NHZG-4iS0VQHC5krrIOOhNz-8";
const IMG_EXCELERATE          = "1LOLGboXrcAmaQcR2VT3Wuo7s5QP7aSwF";
const IMG_EXATHON             = "139YgPfHLP-g2ZNMGpn_qU9CUZ5-CcKM_";
const IMG_CUBEX               = "1OM-Yvbu2K50l5msfUnAgpaYieCjmdiJQ";


const EVENTS = {
  brainstorm: {
    image: IMG_BRAINSTORM,   // Image Id
    event_name: 'BRAINSTORM',                     // Event Name
    date: '24',
    names: [                                      // Name fields
      'Name of Participant 1',
      'Name of Participant 2'
    ],
    team_name: 'Team Name'
  },
  test: {
    image: IMG_DEFAULT,
    event_name: 'TEST EVENT',
    date: '25',
    names: [
      'Name'
    ]
  },
  codeplay: {
    image: IMG_CODEPLAY,
    event_name: 'CODEPLAY',
    date: '24',
    names: [
      "Participant's Name"
    ]
  },
  digibit: {
    image: IMG_DIGIBIT,
    event_name: 'DIGIBIT',
    date: '23',
    names: [
      'Name of Participant 1',
      'Name of Participant 2'
    ],
    team_name: 'Team Name'
  },
  sudo_x: {
    image: IMG_SUDO_X,
    event_name: 'SUDO-X',
    date: '24',
    names: [
      "Participant's Name"
    ]
  },
  crypt_x: {
    image: IMG_CRYPT_X,
    event_name: 'CRYPT-X',
    date: '23',
    names: [
      "Participant's Name"
    ]
  },
  webbed: {
    image: IMG_WEBBED,
    event_name: 'WEBBED',
    date: '23',
    names: [
      "Participant's Name"
    ]
  },
  snappit: {
    image: IMG_SNAPPIT,
    event_name: 'SNAPPIT',
    date: '25',           // FIXME: only because dates not available
    names: [
      "Participant's Name"
    ]
  },
  embleed: {
    image: IMG_EMBLEED,
    event_name: 'EMBLEED',
    date: '25',           // FIXME: same as snappit
    names: [
      "Participant's Name"
    ]
  },
  byte_tales: {
    image: IMG_BYTE_TALES,
    event_name: 'BYTE TALES',
    date: '25',           // FIXME: same as byte tales
    names: [
      "Participant's Name"
    ]
  },
  x_hunt: {
    image: IMG_X_HUNT,
    event_name: 'X-HUNT',
    date: '24',
    names: [
      'Name of Participant 1',
      'Name of Participant 2',
      'Name of Participant 3',
      'Name of Participant 4'
    ],
    team_name: "Team Name"
  },
  verb_o_war: {
    image: IMG_VERB_O_WAR,
    event_name: 'VERB-O-WAR',
    date: '23',
    names: [
      'Name of Participant 1',
      'Name of Participant 2'
    ],
    team_name: "Team Name"
  },
  chexmate: {
    image: IMG_CHEXMATE,
    event_name: 'CHEXMATE',
    date: '23',
    names: [
      "Participant's Name"
    ]
  },
  excelerate: {
    image: IMG_EXCELERATE,
    event_name: 'EXCELERATE',
    date: '24',
    names: [
      'Name of Participant 1',
      'Name of Participant 2',
      'Name of Participant 3',
      'Name of Participant 4',
      'Name of Participant 5',
    ],
    team_name: 'Team Name'
  },
  exathon: {
    image: IMG_EXATHON,
    event_name: 'EXATHON',
    date: '23',
    names: [
      'Name of Participant 1',
      'Name of Participant 2',
      'Name of Participant 3'
    ],
    team_name: 'Team Name'
  },
  cube_x: {
    image: IMG_CUBEX,
    event_name: 'CUBE-X',
    date: '23',
    names: [
      "Participant's Name"
    ]
  }
};

