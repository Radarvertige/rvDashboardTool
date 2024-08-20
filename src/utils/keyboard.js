let isDebug = false;

export const handleKeyPress = (event) => {
  if (event.ctrlKey && event.key === 'b') {
    isDebug = !isDebug;
    console.log(`Debugging is now ${isDebug ? 'enabled' : 'disabled'}`);
  }
};

export const isDebugMode = () => isDebug;
