#  OnlyBooks

![Logo](https://raw.githubusercontent.com/Tech-with-anmol/OnlyBooks/refs/heads/main/assets/images/icon.png)


 <a href="https://github.com/badges/Tech-with-anmol/OnlyBooks" alt="Activity">
        <img src="https://img.shields.io/github/commit-activity/m/Tech-with-anmol/OnlyBooks" /></a>  
        
![version](https://img.shields.io/badge/version-0.0.5-blue)
![Maintain](https://img.shields.io/badge/Maintained-No-red)
![Usage](https://img.shields.io/badge/Using_This-Read_Below-red)
<a href="https://github.com/Tech-with-anmol/OnlyBooks/blob/main/LICENSE.md">
![License](https://img.shields.io/badge/License-Click_here-red)</a>

---
### **Introduction** 

   >**OnlyBooks is a niche exclusive social media, restricting content only to Education/Research and Books powered with exclusive features like Library, domain-specific posting and suggestion.**

### **Feautures**
   
   - Post content including **high quality pictures** 
   - Automatic addition of Book/Material you post about to you **library**
   - Enjoy **niche** exclusive post from around the world.
   - See **other's library/profile**.
   - Follow others and connect with their post more.
   - Personally **connect** with anyone via in app **DM**.
   - Have all your data completely **cloud synced**
   - Enjoy using your account from **any device & anywhere**.
   - See other followers/followings.

 
  >*Small note from my side:- There were multiple features, which i had planned but could not implement due to time restriction, Icc am gong to different place so i don't have time the work on more features/ expansions.*
- **Screenshots**

---


# Development

>**This Section breifly discuss details on project use and different aspects**

*Project Structure*

OnlyBooks

- App - contain all the apps folder and files
- components - conatain resuable component used throught the app
- assests - all aseests and images for app
- lib - basic sdk setup

### Building Locally

---

 As i have used expo managed workflow so you can build via running

 ```bash
 eas build --platform android/ios
 ```
 
 If you want bare react native project
 ```bash
 expo eject
```
>You will also need to modify dependencies and manage builds

- expo-media-picker
- expo-router
- go through dependii to confirm all the expo packages
### Text Editor 
 ---
 I have used expo workflow for making app due to limitations of my computer. So, expo isn't bad tho but yet it is, with expo over time limitations start hitting hard.

 - So, expo don't support rich text editor, so with that in mind, the rich text in the app has few limitations, so keep this in mind, before using it. 
 - As an alternative, you can eject to expo, but it may create some more troubles, as current workflow is very heavly expo depended.
 - incase, if you do so, you will have to rewrite, all routing and lot of components. 
 - and therefore, I heavily advise against doing so, :)


---
>**Use of AI** : Only ai(copilot) was used asking help for errors, else no usage anywhere.

## License

This project is licensed under the terms of the [MIT License with Restrictions](LICENSE).
