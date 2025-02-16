const { ethers } = require('ethers');
const kleur = require("kleur");
const axios = require("axios");
const chains = require('./chains');
const provider = chains.testnet.sahara.provider();
const explorer = chains.testnet.sahara.explorer;
const fs = require('fs');
const moment = require('moment-timezone');
const delay = chains.utils.etc.delay;
const loading = chains.utils.etc.loadingAnimation;
const header = chains.utils.etc.header;
const timelog = chains.utils.etc.timelog;
const countdown = chains.utils.etc.countdown;
const PRIVATE_KEYS = JSON.parse(fs.readFileSync('privateKeys.json', 'utf-8'));
const path = require("path");

function appendLog(message) {
  fs.appendFileSync('log-sahara.txt', message + '\n');
}

async function dailyTransaction(privateKey) {
    const wallet = new ethers.Wallet(privateKey, provider);
	await loading(`Start Transaction for Wallet ${wallet.address}...`, 2000);
    const tx = {
        to: wallet.address,
        value: ethers.parseEther("0.0001"),
    };
    try {
        const signedTx = await wallet.sendTransaction(tx);
        const receipt = await signedTx.wait();
		const successMesssage = `[${timelog()}] Transaction Confirmed: ${explorer.tx(receipt.hash)}`
        console.log(kleur.green(successMesssage));
		appendLog(successMesssage)
    } catch (error) {
        console.error("Error:", error);
    }
}
async function runTransaction() {
    header();
    for (const [index, privateKey] of PRIVATE_KEYS.entries()) {
        try {
            await dailyTransaction(privateKey);
            console.log('');
        } catch (error) {
            const errorMesssage =`[${timelog()}] Error processing wallet ${index + 1}: ${error.message}`;
			console.log(kleur.green(errorMessage));
			appendLog(errorMessage);
        }
    }
}
runTransaction();
