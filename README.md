##STEPS FOR USE
populate a folder with the bg images - only one tier of complexity
name them alphanumerically
so that they remain organized in the folder - this will reduce risk of sequence issues

*download from git hub*

*   point terminal process to desired folder to begin project.  The easiest way to do this, drag folder onto terminal icon 

*    *in terminal*, to clone repo type:

```
git clone https://github.com/trenched/email.git

```
*   *in terminal*, to navigate to repo type:

```
cd email

```

you are now in the interactive-generators node environment

*   in the physical folder *email* (that you cloned from github), you will find a folder named *images* .  Place interactive frames, background images in this folder.  Use a naming convention that will allow them to stack in the sequence you wish them to appear in the email

*   *in terminal*, to run generator type:  

```
gulp interactive-generator

```

*   This will initiate the creation of a folder named dist (distribution)
*   inside this folder are the 2 generated code partials to be used in an email
*   copy and paste the content into the desired template
