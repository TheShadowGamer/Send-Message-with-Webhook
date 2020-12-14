const { React } = require("powercord/webpack");
const { FormTitle, Button } = require("powercord/components");
const { TextAreaInput, SwitchItem, ColorPickerInput, } = require("powercord/components/settings");
const { Modal } = require("powercord/components/modal");
const { post } = require('powercord/http');
const { close: closeModal } = require("powercord/modal");

module.exports = class Webhook extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            WebhookURL: "",
            authorName: "",
            authorUrl: "",
            title: "",
            description: "",
            banner: false,
            image: "",
            color: "",
            userHasInputed: false,
            ValidWH: true,
        };

        this.hasUserInputed = () => {
            if (
            this.state.WebhookURL == "" ||
            this.state.description == ""
        ) {
            this.setState({ userHasInputed: false });
        } else {
            this.setState({ userHasInputed: true });
        }
        };

        this._numberToHex = (color) => {
        const r = (color & 0xff0000) >>> 16;
        const g = (color & 0xff00) >>> 8;
        const b = color & 0xff;
        return `#${r.toString(16).padStart(2, "0")}${g
            .toString(16)
            .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
        };
    }

  render() {
    return (
      <Modal className="powercord-text">
        <Modal.Header>
          <FormTitle tag="h4">Webhook Message Sender</FormTitle>
        </Modal.Header>
        <Modal.Content>
          <TextAreaInput
            onChange={async (o) => {
              await this.setState({ WebhookURL: o.toString() });
              this.hasUserInputed();
            }}
            rows={1}
          >
            Webhook URL
          </TextAreaInput>
          <h5 className="colorStandard-2KCXvj size14-e6ZScH h5-18_1nd title-3sZWYQ defaultMarginh5-2mL-bP" hidden={this.state.ValidWH} >That is not a valid Webhook URL!</h5>
          <TextAreaInput
            onChange={async (o) => {
              await this.setState({ authorName: o.toString() });
              this.hasUserInputed();
            }}
            rows={1}
          >
            Author Name
          </TextAreaInput>
          <TextAreaInput
            onChange={(o) => {
              this.setState({ authorUrl: o.toString() });
            }}
            rows={1}
          >
            Author URL
          </TextAreaInput>
          <TextAreaInput
            onChange={async (o) => {
              await this.setState({ title: o.toString() });
              this.hasUserInputed();
            }}
            rows={1}
          >
            Title
          </TextAreaInput>
          <TextAreaInput
            onChange={async (o) => {
              await this.setState({ description: o.toString() });
              this.hasUserInputed();
            }}
            rows={4}
          >
            Description
          </TextAreaInput>
          <TextAreaInput
            onChange={async (o) => {
              await this.setState({ image: o.toString() });
              this.hasUserInputed();
            }}
            rows={1}
          >
            Image URL
          </TextAreaInput>
          <SwitchItem
            note="Makes the image banner-sized."
            value={this.state.banner}
            onChange={() => {
              this.setState({ banner: !this.state.banner });
            }}
          >
            Image Banner
          </SwitchItem>
          <ColorPickerInput
            onChange={(c) =>
              this.setState({ color: c ? this._numberToHex(c) : null })
            }
            default={parseInt("202225", 16)}
            value={
              this.state.color ? parseInt(this.state.color.slice(1), 16) : 0
            }
          >
            Color
          </ColorPickerInput>
          <div style={{ marginBottom: 20 }} />
        </Modal.Content>
        <Modal.Footer>
          <Button
            color={Button.Colors.GREEN}
            disabled={!this.state.userHasInputed}
            onClick={async () => {
              post('https://webhook-api.powercord.dev/send')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({ url: this.state.WebhookURL, description: this.state.description, title: this.state.title, authorUrl: this.state.authorUrl, authorName: this.state.authorName, color: this.state.color, image: this.state.image, banner: this.state.banner}) 
                .then(response => {
                  if(response.body.status == "ok") return closeModal()
                  if(response.body.status == "error" && response.body.reason == "Invalid Webhook") { 
                    this.setState({ ValidWH: false}) 
                    this.render()
                  }                  
                })
                .catch(err => console.log("Please ping the developer in #plugin-support with a screenshot of this error!\n\n" + err))
            }}
          >
            Send
          </Button>
          <Button
            onClick={closeModal}
            look={Button.Looks.LINK}
            color={Button.Colors.TRANSPARENT}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}