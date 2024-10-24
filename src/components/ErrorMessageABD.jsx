import React, { useEffect, useRef } from "react";
import "../styles/ErrorMessageABD.css"; // Import a CSS file for styling

const ErrorMessageABD = ({ text, isSuccess, isVisible, setVisible }) => {
    const textRef = useRef(null);
    const consoleRef = useRef(null);

    useEffect(() => {
        const colors = [isSuccess ? 'green' : 'red']; // Determine colors based on isSuccess

        let visible = true;
        let letterCount = 0;
        let waiting = false;
        let isRemoving = false;

        if (isVisible && textRef.current && consoleRef.current) {
            textRef.current.setAttribute('style', 'color:' + colors[0]);

            const textInterval = window.setInterval(() => {
                if (!isRemoving) {
                    // Increment letterCount to display text
                    if (letterCount < text.length && !waiting) {
                        letterCount++;
                        textRef.current.innerHTML = text.substring(0, letterCount);
                    } else if (letterCount === text.length && !waiting) {
                        waiting = true;
                        // Wait for 1 second before starting to remove
                        setTimeout(() => {
                            isRemoving = true;
                            waiting = false;
                        }, 1000);
                    }
                } else {
                    // Decrement letterCount to remove text
                    if (letterCount > 0 && !waiting) {
                        letterCount--;
                        textRef.current.innerHTML = text.substring(0, letterCount);
                    } else if (letterCount === 0) {
                        clearInterval(textInterval); // Stop the interval once text is fully removed
                        textRef.current.innerHTML = ""; // Clear the message
                        setVisible(false); // Hide the component
                    }
                }
            }, 50); // Adjusted interval for faster display

            const underscoreInterval = window.setInterval(() => {
                consoleRef.current.className = visible ? 'console-underscore hidden' : 'console-underscore';
                visible = !visible;
            }, 100);

            return () => {
                clearInterval(textInterval);
                clearInterval(underscoreInterval);
            };
        }
    }, [text, isSuccess, isVisible, setVisible]); // Re-run effect when text, isSuccess, or isVisible changes

    return (
        isVisible && (
            <div className='console-container'>
                <span ref={textRef} id='text'></span>
                <div className='console-underscore' ref={consoleRef}></div>
            </div>
        )
    );
};

export default ErrorMessageABD;
