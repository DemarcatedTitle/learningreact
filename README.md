I started this project to learn React. 

Started it as a browser only react project, so it would easily go on github pages. Decided I should use create react app to learn about that and use it's update instantly feature, which is nice. 

Had a few problems with set state in terms of understanding what was going on, there was something that was working, but to my understanding shouldn't have worked. After a lot of research I realized it was caused by mutating data unintentionally. From this decided to explore Immutable data. 

Have had an interest in Functional Programming and decided to try and experiment with that here. Pure components if I recall correctly are kind of in this vein. There also seemed to be a noticeable performance difference when I converted some of my components to pure components. 

Using Immutablejs made it easy to convert into pure components, a benefit of immutable data. Although after solving the conceptual hurdle earlier, I ran into the problem of things not being updated immediately, so you would press a button and the active square would move fast if you held it down, but it would skip squares instead of moving smoothly through it. 

I introduced a tick to solve this, but that feels like a stopgap thing because it's not up to the speed I want it to be. I am aware of the concept of game engines, but I figured that doing it with react would be a better way to learn a more immediately useful skillset. 

In the future the next things I plan to add are more "abilities". I will maybe turn it into some kind of multiplayer bomberman or snake type of game, maybe both. I was thinking first flesh out how I'm going to have all the squares do what I want them to, beyond individual squares (so, bomb explodes and affects the squares in the desired shape, snake's tail follows and has an effect on enemy player's squares, etc).

After that I think I might start to flesh out how to get it multiplayer from different browsers instead of being stuck on the same keyboard. 

And after that I think maybe some sort of basic user system with a scoreboard. 

I am interested in learning the Functional Programming aspect, but I think there will be some kind of balance of learning the paradigm and getting stuff done. 
