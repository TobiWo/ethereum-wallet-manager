import { utils } from 'ethers';
import * as readline from 'readline';

class WalletCreator {
  private userInput: readline.Interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  async createWallet(): Promise<void> {
    if (await this.isUserOffline()) {
      const entropy: Uint8Array = utils.randomBytes(32);
      const mnemonicPhrase: string = utils.entropyToMnemonic(entropy);
      const hdNode: utils.HDNode = utils.HDNode.fromMnemonic(mnemonicPhrase);
      const standardEthereumNode: utils.HDNode = hdNode.derivePath("m/44'/60'/0'/0/0");
      console.log(`\nYour address:\t${standardEthereumNode.address}`);
      console.log(`Your mnemonic:\t${mnemonicPhrase}`);
      console.log('\nStore your mnemonic safely and close your terminal before you go online again.');
      return;
    }
    console.log('You cancelled wallet creation process!');
  }

  private async isUserOffline(): Promise<boolean> {
    console.log(
      'Just to be 100% safe that nobody can fetch your mnemonic phrase from your computer, it is recommended to create a wallet without an active internet connection!'
    );
    const answer: string = await this.question('Are you offline or want to proceed anyway (yes/no)? ');
    return answer.toLowerCase() != 'y' && answer.toLowerCase() != 'yes' ? false : true;
  }

  private question(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.userInput.question(question, resolve);
    });
  }
}

const walletCreator: WalletCreator = new WalletCreator();
walletCreator
  .createWallet()
  .catch(console.error)
  .finally(() => process.exit());
