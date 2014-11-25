# Bulletin Widget

## Introduction
The Bulletin Widget enables you to select a Bulletin that you have created using the Bulletin App, and display it in a Presentation.

If the *Bulletin Settings* window is opened, and a Bulletin has already been selected, the Widget extracts details about that Bulletin from Google Drive, and shows its name and resolution. A message is displayed if the resolution of the Bulletin does not match the resolution of the Placeholder. The Widget uses [Google Picker](https://developers.google.com/picker/) to enable a user to select a Bulletin directly from their Google Drive. If *New* is selected then, after prompting for a name, the Widget opens the Bulletin App in a new tab and creates the Bulletin in the *Bulletins* folder of the user’s Google Drive. Selecting *Edit* opens the existing Bulletin in the Bulletin App in a new tab.

When run, the Widget shows the Bulletin inside of an `iframe`. Because the file name is part of the Bulletin’s URL, if the user were to change the name of the Bulletin via the Google Drive UI, the URL would no longer be valid. To get around this problem, a Google Apps script is used that takes the folder ID and file ID as parameters, and returns the dynamically constructed URL. The Bulletin calls this script as per the *Data Refresh Interval* setting.

Bulletin Widget works in conjunction with [Rise Vision](http://www.risevision.com), the [digital signage management application](http://rva.risevision.com/) that runs on [Google Cloud](https://cloud.google.com).

At this time Chrome is the only browser that this project and Rise Vision supports.

## Development

### Dependencies
* [Git](http://git-scm.com/) - Git is a free and open source distributed version control system that is used to manage our source code on Github.

### Local Development Environment Setup and Installation
To make changes to the Widget, you'll first need to install [Git](http://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

The Widget can now be installed by executing the following command in Terminal:
```
git clone https://github.com/Rise-Vision/widget-bulletin.git
```

### Deployment
Once you are satisifed with your changes, deploy them to your server. In the Rise Vision Platform, you can then add your custom Widget via the *Gadgets* tab. Give your Widget a name, select a *Type* of *Widget*, paste the link to the `bulletin.html` file in the *URL* field, and the link to the `bulletinUI.html` file in the *Custom UI URL* field:

![Add a Widget](https://cloud.githubusercontent.com/assets/1190420/5113377/2f2d9240-6ffd-11e4-98ad-a484c1fa7183.png)

## Submitting Issues
If you encounter problems or find defects we really want to hear about them. If you could take the time to add them as issues to this Repository it would be most appreciated. When reporting issues, please use the following format where applicable:

**Reproduction Steps**

1. did this
2. then that
3. followed by this (screenshots / video captures always help)

**Expected Results**

What you expected to happen.

**Actual Results**

What actually happened. (screenshots / video captures always help)

## Contributing
All contributions are greatly appreciated and welcome! If you would first like to sound out your contribution ideas, please post your thoughts to our [community](http://community.risevision.com), otherwise submit a pull request and we will do our best to incorporate it.

## Resources
If you have any questions or problems, please don't hesitate to join our lively and responsive community at http://community.risevision.com.

If you are looking for user documentation on Rise Vision, please see http://www.risevision.com/help/users/

If you would like more information on developing applications for Rise Vision, please visit http://www.risevision.com/help/developers/.

**Facilitator**

[Donna Peplinskie](https://github.com/donnapep "Donna Peplinskie")