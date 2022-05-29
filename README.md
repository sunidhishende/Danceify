# Danceify

Danceify is a website where users can learn how to dance with Machine Learning

## Live Project
[https://danceify.vercel.app/](https://danceify.vercel.app/)
## Installation
Fork or Clone the project

Use the package manager npm to install the dependencies.

```bash
npm install
```

## Features
1. Clean, minimalistic UI to reduce user's activation energy to start learning
2. Real time Body tracking along with a follow along video
3. Real time score to tell the user how the user is performing
4. A graph of how the user performed after completing each level
5. A download button for the user to download their dance after each level

## Working
### Calculation of the score
Movenet model detects 17 keypoints of the body such as nose, left elbow, right knee, etc.

For calculating the score, I have used the method of gradients (calculating the slope of the segments connecting the keypoints. ) because the gradient of the user will remain same for all video conditions, therefore the placement of the camera need not be considered.

The gradients in the dance video are pre-calculated and are compared to the gradients of the user in real time. 

## Demonstration
![home page](https://github.com/sunidhishende/Danceify/blob/newest/public/images/homepage.png)
![levels page](https://github.com/sunidhishende/Danceify/blob/newest/public/images/levels.png)
![level1](https://github.com/sunidhishende/Danceify/blob/newest/public/images/level1.png)
![graph](https://github.com/sunidhishende/Danceify/blob/newest/public/images/graph.png)
![download button](https://github.com/sunidhishende/Danceify/blob/newest/public/images/download.png)

## Technologies used
1. React
2. TensorFlow

## Challenges Faced and Learnings
1. Being new to Machine Learning, it was very interesting and fun to understand the basics and read a lot of research papers and documentation.
2. One of the biggest challenges was to display the score real time and sync it with the video. I commited plenty of mistakes, but learnt that whenever in doubt go back to the docs. 

## Future Scope
I'm very excited about this project and will continue building it. Some of the features I'd like to implement are:
1. Ability to give score for multiple people in a frame
2. Adjust the speed of the video so that users can learn in their preferred speed
3. Adding multiple styles of dancing like tutting, ballet, etc.