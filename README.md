# Minimalist Checkers

## Screenshot

![Game Screenshot](https://i.imgur.com/alR8VY2.png)

## Description

**Minimalist Checkers** is a modern take on the classic game of checkers, built with a focus on clean design and intuitive gameplay. Players take turns moving their pieces diagonally, capturing opponents' pieces, and promoting their pieces to kings. The game implements American rules and showcases a sleek minimalist interface.

I chose this project because of my personal connection to the game, as I used to play it a lot with my father. Additionally, I wanted to challenge myself to see how well I could recreate this game independently while building on my skills in logic, DOM manipulation, and CSS design.

## Getting Started

- [Play the Game Here](https://minimalistcheckers.surge.sh/)

### Instructions

1. **Objective:** Capture all of your opponent’s pieces or block them from making any moves.
2. **How to Play:**
    - Regular pieces move diagonally forward.
    - Kings can move diagonally in any direction.
    - Jump over opponent pieces to capture them.
    - Perform multiple captures in a single turn if possible.
3. **Winning Conditions:** The game ends when one player has no pieces left or cannot make a valid move.

# User Stories

- As a player, I want to see the checkers board with pieces set up at the start with instructions, so that I can easily understand the game setup and rules.

- As a player, I want to be informed of whose turn it is, so that I know when to make my move.

- As a player, I want to be able to select a piece by clicking on it, so that I can choose which piece to move.

- As a player, I want to see the valid moves highlighted when I select a piece, so that I know where I can move.

- As a player, I want the piece to move to the selected square when I click on a highlighted option, so that I can make my moves efficiently.

- As a player, I want any captured opponent pieces to disappear from the board, so that I can clearly see my progress in the game.

- As a player, I want my piece to be promoted to a king when it reaches the opposite end, so that I gain additional movement abilities with that piece.

- As a player, I want to see the turn switch after each move, so that I can easily follow the game flow.

- As a player, I want to be notified if I’ve won or lost, so that I understand the outcome of the game.

- As a player, I want the option to start a new game when one game ends, so that I can continue playing without resetting manually.

# Pseudocode

1. **Variables Needed:** Set up variables to track the board layout, which player’s turn it is, and possible moves.

2. **Main Elements on Page:** Link to the main game area, turn display, messages, and restart button.

3. **Set Up the Game at Start:** Load the board, pieces, and show whose turn it is.

4. **How the Game Looks:** Show the pieces in their places and display whose turn it is.

5. **Game Rules and Setup:** Define board size (8x8), colors for each player (black and white), and normal vs. king pieces.

6. **Piece Clicks:** When a player clicks a piece, check if it’s their turn and show possible moves.

7. **Find Valid Moves:** Calculate where each piece can move, depending on the type (normal or king).

8. **Click on a Square to Move:** Move the piece if the player clicks a valid square, removing any captured pieces.

9. **Turn Change:** Switch to the next player, clear highlights, and update the display.

10. **Check for Win/Loss:** If a player has no moves or pieces left, announce the winner; otherwise, continue turns.

11. **Restart the Game:** Reset everything to start a new game when the player clicks the reset button.

12. **Improve Display and Accessibility:** Make sure the colors are easy to see, messages are clear, and pieces have labels for accessibility.

## Planning Materials

### Tutorials and Guides

- **"How I Built a Checkers Game with JavaScript"**  
  This article provides a step-by-step guide to creating a checkers game using JavaScript, covering game logic and DOM manipulation. [Read more](https://www.freecodecamp.org/news/how-i-built-a-checkers-game-with-javascript/)

- **"Checkers Game - Vanilla JavaScript - CodePen"**  
  An interactive example of a checkers game implemented with HTML, CSS, and JavaScript, useful for understanding layout and interactivity. [View example](https://codepen.io/anon/pen/xyz123)

### Videos

- **"🕹️ Build Your Own Checkers Game with HTML, CSS, and JavaScript!"**  
  A comprehensive video tutorial guiding you through building a checkers game from scratch. [Watch video](https://www.youtube.com/watch?v=abc123)

### AMOLED CSS Styling

- **"Exact CSS Styling from the August 2022 AMOLED Mode Experiment"**  
  A GitHub repository providing CSS styles for AMOLED mode, which can be adapted for dark mode themes in your project. [View repository](https://github.com/user/amoled-css)

- **"AMOLED-Cord - BetterDiscord"**  
  A theme designed for AMOLED screens, offering insights into color schemes and styling suitable for dark mode interfaces. [Learn more](https://betterdiscord.app/theme/amoled-cord)

- **"Dark Mode In CSS"**  
  An article discussing techniques for implementing dark mode using CSS, relevant for creating AMOLED-friendly designs. [Read article](https://css-tricks.com/dark-mode-in-css/)

## Technologies Used

- **HTML**: For structuring the application.
- **CSS**: For styling and layout using Flexbox and Grid.
- **JavaScript**: For game logic, DOM manipulation, and event handling.

## Next Steps

Here are some potential future enhancements for the game:

- Add **sound effects** for piece movements and game events.
- Introduce **AI for a computer opponent**.
- Store player progress and preferences using **localStorage**.
- Improve accessibility with enhanced keyboard navigation.
- Add **more game mode options** to customize gameplay experiences.
- Implement a **forced mode** where players must capture pieces if a valid jump is available.

---

Thank you for exploring my project! Feedback and contributions are welcome.
