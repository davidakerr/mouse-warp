# Mouse Warp

![mouse-warp](./images/header_image.png)

# What problem does this solve ?

If you have rearranged your extended displays in Windows 10 such that two edges are not connecting in the preview,
the mouse will not travel between them.

# How does it do it?

Currently, it maps the right edge of your first selected display to the left edge of the second selected display.

# How to use

_This UX should improve in the future._

- Open the app
- Select the first display you wish to connect
- Select the second display you wish to connect
- Mouse pointer should now move freely between screens
- Feel free to close the screen selection window

# Todo

- Persistent Settings
- Clean up code

Todo

- Persistent Settings
- Clean up code
- Have a refresh button for when the displays are repositioned (currently have to restart the app)

# How to compile yourself

- Make sure you have windows-build-tools installed
- node-gyp
- python

Have a look at the main.yaml workflow for inspiration.

Any suggestions or PR's are most welcome.
