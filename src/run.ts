import { randomBytes, Mnemonic, HDNodeWallet, Wallet } from 'ethers';
const chalk = import('chalk').then((m) => m.default);
const _chalk = await chalk;
import Prompts from 'prompts';

class WalletManager {
  /**
   * Create new or manage existing EVM (Ethereum Virtual Machine) based EOA (Externally Owned Account) wallets
   */

  /**
   * Main workflow function
   *
   */
  async manageWallet(): Promise<void> {
    try {
      await this.isUserOffline();
      const howToProceed = await this.promptHowToProceed();
      const mnemonic = await this.createMnemonic(howToProceed);
      const wallet = await this.createWallet(howToProceed, mnemonic);
      this.logWalletInformation(wallet, mnemonic);
    } catch (error) {
      console.log(_chalk.red('You cancelled the wallet creation/loading process!'));
    }
  }

  /**
   * Creates a mnemonic if the respective option was choosen from the cli prompt
   *
   * @param howToProceed - The workflow option choosen by the user
   */
  private async createMnemonic(howToProceed: string): Promise<Mnemonic | null> {
    if (howToProceed != 'keystore') {
      const entropy: Uint8Array = randomBytes(32);
      let mnemonic: Mnemonic = Mnemonic.fromEntropy(entropy);
      if (howToProceed === 'existing') {
        const existingMnemonic = await this.promptSecret('Mnemonic:');
        try {
          mnemonic = Mnemonic.fromPhrase(existingMnemonic);
        } catch (error) {
          console.log(_chalk.red('The provided mnemonic is not correct! Please double-check!'));
          process.exit(1);
        }
      }
      return mnemonic;
    }
    return null;
  }

  /**
   * Creates a wallet based on the user input
   *
   * @param howToProceed - The workflow option choosen by the user
   * @param mnemonic - The created mnemonic
   */
  private async createWallet(howToProceed: string, mnemonic: Mnemonic | null): Promise<Wallet | HDNodeWallet> {
    let wallet: Wallet | HDNodeWallet = Wallet.createRandom();
    if (mnemonic && (howToProceed === 'existing' || howToProceed === 'new')) {
      const derivationPath = await this.promptForDerivationPath();
      try {
        wallet = HDNodeWallet.fromMnemonic(mnemonic, derivationPath);
      } catch {
        console.log(_chalk.red('The provided derivation path is not correct! Please double-check!'));
        process.exit(1);
      }
    } else {
      const keystore = await this.promptSecret('Keystore:');
      const password = await this.promptSecret('Password:');
      try {
        wallet = Wallet.fromEncryptedJsonSync(keystore, password);
      } catch (error) {
        console.log(_chalk.red('The provided keystore json is not correct! Please double-check!'));
        process.exit(1);
      }
    }
    return wallet;
  }

  /**
   * Logs information for the created wallet
   *
   * @param wallet - The created wallet
   * @param mnemonic - The created mnemonic
   */
  private logWalletInformation(wallet: Wallet | HDNodeWallet, mnemonic: Mnemonic | null): void {
    if (mnemonic) {
      console.log(_chalk.green(`\nYour wallet mnemonic:\t\t${mnemonic.phrase}`));
      console.log(_chalk.green(`Your wallet address:\t\t${wallet.address}`));
    } else {
      console.log(_chalk.green(`\nYour wallet address:\t\t${wallet.address}`));
    }
    console.log(_chalk.green(`Your addresses private key:\t${wallet.privateKey}`));
    console.log(_chalk.green('\nStore your secrets safely and close your terminal before you go online again.'));
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
   * Prompts for hd derivation path
   *
   * @param message - The message which will displayed for the user
   */
  private async promptForDerivationPath(): Promise<string> {
    const answer = await Prompts({
      type: 'text',
      name: 'value',
      message:
        'Used HD derivation path (for more info see: https://help.myetherwallet.com/en/articles/5867305-hd-wallets-and-derivation-paths - default is Ethereum path): ',
      initial: "m/44'/60'/0'/0/0",
    });
    if (!answer.value) {
      throw new Error();
    }
    return answer.value;
  }

  /**
   * Prompts for confirming or denying a question
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
    if (!answer.value) {
      throw new Error();
    }
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
    if (!answer.value) {
      throw new Error();
    }
    return answer.value;
  }

  /**
   * Asks the user how to proceed
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
    if (!answer.value) {
      throw new Error();
    }
    return answer.value;
  }
}

const walletManager: WalletManager = new WalletManager();
walletManager
  .manageWallet()
  .catch(console.error)
  .finally(() => process.exit(0));
