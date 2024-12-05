
import React, { useState, useEffect, useRef } from 'react';
//import './CaptchaGame.css'; // Nous ajouterons un fichier CSS pour le style
export const Catch = () =>{
// src/components/CaptchaGame.js
  const [isBallCaught, setIsBallCaught] = useState(false);
  const [message, setMessage] = useState('');
  const [isGameActive, setIsGameActive] = useState(true);
  const ballRef = useRef(null);
  const targetRef = useRef(null);
  const buttonRef = useRef(null);

  // Vérifier si la balle est cliquée dans la cible
  const handleBallClick = () => {
    const ballRect = ballRef.current.getBoundingClientRect();
    const targetRect = targetRef.current.getBoundingClientRect();

    if (
      ballRect.x + ballRect.width > targetRect.x &&
      ballRect.x < targetRect.x + targetRect.width &&
      ballRect.y + ballRect.height > targetRect.y &&
      ballRect.y < targetRect.y + targetRect.height
    ) {
      setIsBallCaught(true);
      setMessage("Bravo! Vous avez attrapé la balle.");
      buttonRef.current.disabled = false; // Activer le bouton de validation
    }
  };

  // Réinitialiser le jeu
  const resetGame = () => {
    setIsBallCaught(false);
    setMessage('');
    buttonRef.current.disabled = true;
    ballRef.current.style.top = '0px';
    ballRef.current.style.left = '0px';
    setIsGameActive(true);
  };

  // Animation de la balle
  useEffect(() => {
    if (isGameActive) {
      let animationId;
      let topPosition = 0;
      let leftPosition = 0;
      let directionX = 1;
      let directionY = 1;

      const moveBall = () => {
        if (isBallCaught) return; // Arrêter le mouvement si la balle est attrapée

        const gameArea = document.getElementById('gameArea');
        const gameAreaRect = gameArea.getBoundingClientRect();
        const ballRect = ballRef.current.getBoundingClientRect();

        // Changer de direction si la balle touche les bords
        if (ballRect.top + ballRect.height >= gameAreaRect.height || ballRect.top <= gameAreaRect.top) {
          directionY *= -1;
        }

        if (ballRect.left + ballRect.width >= gameAreaRect.width || ballRect.left <= gameAreaRect.left) {
          directionX *= -1;
        }

        topPosition += 2 * directionY;
        leftPosition += 2 * directionX;

        ballRef.current.style.top = `${topPosition}px`;
        ballRef.current.style.left = `${leftPosition}px`;

        animationId = requestAnimationFrame(moveBall);
      };

      moveBall();

      return () => cancelAnimationFrame(animationId);
    }
  }, [isBallCaught, isGameActive]);

  const handleSubmit = () => {
    if (isBallCaught) {
      alert('Captcha validé avec succès!');
      resetGame();
    } else {
      alert('Vous n\'avez pas attrapé la balle !');
    }
  };

  return (
    <div className="game-container">
      <h1>Attrapez la balle pour valider !</h1>
      <div id="gameArea">
        <div id="ball" ref={ballRef} onClick={handleBallClick}></div>
        <div id="target" ref={targetRef}></div>
      </div>
      <p>{message}</p>
      <button ref={buttonRef} onClick={handleSubmit} disabled>
        Valider
      </button>
    </div>
  );
};


