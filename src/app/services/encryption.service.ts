import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EncryptionService {

    private publicKey: string = environment.encryptPublicKey;
    private privateKey: string = environment.encryptPrivateKey;
    private secretKey: string = environment.secretKey;

    encrypt(data: string): string {
        if (!data) {
            return '';
        }
        let chars = this.swapAdjacentCharacters(JSON.stringify(data));
        let encryptedData = encodeURIComponent(chars);
        return encryptedData;
    }

    decrypt(encryptedData: any): any {
        if (!encryptedData) {
            return '';
        }
        let chars = decodeURIComponent(encryptedData);
        let decryptedData = JSON.parse(this.revertSwappedCharacters(chars));
        return decryptedData;
    }

    private swapAdjacentCharacters(inputString: string): string {
        const characters = inputString.split('');
        for (let i = 0; i < characters.length - 1; i += 2) {
            const temp = characters[i];
            characters[i] = characters[i + 1];
            characters[i + 1] = temp;
        }
        return characters.join('');
    }

    private revertSwappedCharacters(inputString: string): string {
        const characters = inputString.split('');
        for (let i = 0; i < characters.length - 1; i += 2) {
            const temp = characters[i];
            characters[i] = characters[i + 1];
            characters[i + 1] = temp;
        }
        return characters.join('');
    }

}
