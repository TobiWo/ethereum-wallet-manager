import { randomBytes, Mnemonic, HDNodeWallet, Wallet } from 'ethers';
const chalk = import('chalk').then((m) => m.default);
const _chalk = await chalk;
import Prompts from 'prompts';

class WalletCreator {
  /**
   * Creates a random 24-word mnemonic for an hd-wallet
   */

  private DERIVATION_PATH = "m/44'/60'/0'/0/0";
  private wallet: Wallet | HDNodeWallet = Wallet.createRandom();

  async createWallet(): Promise<void> {
    if (await this.isUserOffline()) {
      const entropy: Uint8Array = randomBytes(32);
      let mnemonic: Mnemonic = Mnemonic.fromEntropy(entropy);
      const proceed = await this.promptHowToProceed();
      if (proceed === 'existing') {
        const existingMnemonic = await this.promptSecret('Mnemonic:');
        mnemonic = Mnemonic.fromPhrase(existingMnemonic);
      } else if (proceed === 'keystore') {
        const keystore = await this.promptSecret('Keystore:');
        const password = await this.promptSecret('Password:');
        this.wallet = Wallet.fromEncryptedJsonSync(keystore, password);
      }
      if (proceed === 'existing' || proceed === 'new') {
        this.wallet = HDNodeWallet.fromMnemonic(mnemonic, this.DERIVATION_PATH);
        console.log(_chalk.green(`\nYour wallet mnemonic:\t\t${mnemonic.phrase}`));
      }
      if (proceed) {
        console.log(_chalk.green(`Your wallet address:\t\t${this.wallet.address}`));
        console.log(_chalk.green(`Your addresses private key:\t${this.wallet.privateKey}`));
        console.log(_chalk.green('\nStore your secrets safely and close your terminal before you go online again.'));
        return;
      }
    }
    console.log(_chalk.red('You cancelled the wallet creation/loading process!'));
  }

  private async isUserOffline(): Promise<boolean> {
    console.log(
      _chalk.yellowBright(
        'Just to be 100% safe that nobody can fetch your mnemonic phrase or private key from your computer, it is recommended to create a wallet without an active internet connection!'
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

  /**
   * Prompts the user for a secret
   *
   * @param message - The output to be displayed for the user
   * @returns The secret entered by the user
   */
  private async promptSecret(message: string): Promise<string> {
    const answer = await Prompts({
      type: 'password',
      name: 'value',
      message: message,
    });
    return answer.value;
  }

  /**
   * Prompts the user whether to create a new wallet or log address and private key for existing one
   *
   * @returns The selection made by the user
   */
  private async promptHowToProceed(): Promise<string> {
    const answer = await Prompts({
      type: 'select',
      name: 'value',
      message: 'How to proceed?',
      choices: [
        { title: 'Create new mnemonic and wallet', value: 'new' },
        { title: 'Return information from existing mnemonic', value: 'existing' },
        { title: 'Return private key from keystore file', value: 'keystore' },
      ],
    });
    return answer.value;
  }
}

const walletCreator: WalletCreator = new WalletCreator();
walletCreator
  .createWallet()
  .catch(console.error)
  .finally(() => process.exit());
