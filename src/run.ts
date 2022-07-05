import { utils } from 'ethers';
import chalk from 'chalk';
import Prompts from 'prompts';

class WalletCreator {
  /**
   * Creates a random 24-word mnemonic for an hd-wallet
   */
  async createWallet(): Promise<void> {
    if (await this.isUserOffline()) {
      const entropy: Uint8Array = utils.randomBytes(32);
      const mnemonicPhrase: string = utils.entropyToMnemonic(entropy);
      const hdNode: utils.HDNode = utils.HDNode.fromMnemonic(mnemonicPhrase);
      const standardEthereumNode: utils.HDNode = hdNode.derivePath("m/44'/60'/0'/0/0");
      console.log(chalk.green(`\nYour address:\t${standardEthereumNode.address}`));
      console.log(chalk.green(`Your mnemonic:\t${mnemonicPhrase}`));
      console.log(chalk.green('\nStore your mnemonic safely and close your terminal before you go online again.'));
      return;
    }
    console.log(chalk.red('You cancelled the wallet creation process!'));
  }

  private async isUserOffline(): Promise<boolean> {
    console.log(
      chalk.yellowBright(
        'Just to be 100% safe that nobody can fetch your mnemonic phrase from your computer, it is recommended to create a wallet without an active internet connection!'
      )
    );
    return await this.promptForConfirmation('Are you offline or want to proceed anyway (yes/no)? ');
  }

  /**
   * Prompts for confirming or denying a question.
   *
   * @param message - The message which will displayed for the user
   */
  private async promptForConfirmation(message: string): Promise<boolean> {
    const answer = await Prompts({
      type: 'confirm',
      name: 'value',
      message: message,
      initial: false,
    });
    return answer.value;
  }
}

const walletCreator: WalletCreator = new WalletCreator();
walletCreator
  .createWallet()
  .catch(console.error)
  .finally(() => process.exit());
