function encrpyt (str: string) {
  const strArr = str.split('');

  return strArr.map((character) => String.fromCharCode(character.charCodeAt(0) + 1)).join('');
}

export default encrpyt;