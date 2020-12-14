const { React, getModule, getModuleByDisplayName } = require("powercord/webpack");
const { Plugin } = require("powercord/entities");
const { inject, uninject } = require("powercord/injector");

const { open } = require("powercord/modal");
const { Icon } = require("powercord/components")
const Webhook = require("./components/Webhook");

module.exports = class SendMsgWithWebhook extends Plugin {
  async startPlugin() {
    const HeaderBarContainer = await getModuleByDisplayName('HeaderBarContainer')
    const classes = await getModule([ 'iconWrapper', 'clickable' ]);
    inject("send-msg-with-webhook", HeaderBarContainer.prototype, "render", (args, res) => {
      if (!res.props.toolbar) {
        res.props.toolbar = React.createElement(React.Fragment, { children: [] });
      }

      res.props.toolbar.props.children.push(
        React.createElement(HeaderBarContainer.Icon, {
          onClick: () => open(() => React.createElement(Webhook)),
          icon: () => React.createElement(Icon, {
            className: classes.icon,
            name: 'Webhook'
          }),
          tooltip: "Webhook Message Sender"
        }),
      )
      return res;
    });
    //HeaderBarContainer.prototype.__proto__.forceUpdate()
  }

  pluginWillUnload() {
    uninject("send-msg-with-webhook");
  }
};