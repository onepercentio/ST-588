# ST-588 - Brazilian Security Token

## Intro - pt_BR

Bem-vindo ao projeto de Security Tokens para a resolução 588 da CVM, que regulamenta o crowdfunding no Brasil.

Este token implementa características do [ERC-20](https://theethereum.wiki/w/index.php/ERC20_Token_Standard) e [ERC-884](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-884.md), utilizado no estado de Delaware nos EUA. O objetivo do ST-588 é implementar as funcionalidades mínimas para atender com segurança às regras da regulação 588, mantendo, o máximo possível, compatibilidade com o padrão ERC-20, já amplamente aceito e utilizado no mercado crypto.

O funcionamento deste padrão se dá por dois contratos: uma Authorized List e um Token Contract. A Authorized List é utilizada pelo emissor dos Tokens para adicionar investidores, enquanto o segundo contrato regula o comportamento do token. 

A primeira implementação conhecida desse padrão é a feita pela Kria. [site](https://www.kria.vc) [White Paper](https://www.kria.vc/Whitepaper-Basement-v1.pdf) 

Atenção: a utilização deste código para gerar Security Tokens não o exime de consultar a CVM quanto a adequação do modelo de negócio à resolução 588.

### Funcionalidades adicionadas ao padrão ERC-20

Para contornar possíveis eventos de perda de chave por parte do token holder, uma funcionalidade de queima de tokens, restrita ao proprietário do contrato, foi adicionada. A função burnFor() foi idealizada para ser parte de um processo de recuperação de tokens iniciada off-chain, culminando com a queima de tokens do usuário propriamente identificado e, subsequentemente, a geração da mesma quantidade de tokens para o novo endereço público da carteira indicada pelo token holder.

### Pontos de divergência com o padrão ERC-20

Tendo sido desenvolvido com o objetivo de conceder poderes de regulador (?) ao proprietário do contrato de token, a fim de atender aos critérios regulatórios da CVM, o comportamento do ST-588 difere do ERC-20 em dois pontos:

* Acesso restrito: se no ERC-20 o acesso aos tokens e transações é irrestrito, no ST-588 é controlado pela entidade proprietária do contrato, através de checks em whitelist. Isto significa que somente participantes previamente autorizados podem transacionar tokens. O processo de onboarding do investidor é realizado off-chain.
* Queima de tokens restrita: no ERC-20, é possível “queimar” tokens ao efetuar uma transferência para um endereço vazio (0x0). O ST-588, havendo sido criado para representar ativos legais, teve essa funcionalidade restrita à entidade proprietária do token.

## Intro - en

Welcome to the Security Tokens project made for CVM's (Brazilian Securities Commission) resolution #588, which regulates crowdfunding activities in Brazil.

This token inherits features from standards [ERC-20](https://theethereum.wiki/w/index.php/ERC20_Token_Standard) e [ERC-884](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-884.md), used in Delaware, US. The main goal with this proposal is to implement as little features as possible to make it compliant with Brazilian regulations while keeping it compatible with ERC-20 standard, which is widely accepted and used in the crypto market.

The ST-588 works by means of two contracts: a whitelist and a token contract. The former is used by the token issuer to allow investors to make transactions, while the latter regulates the token behavior.

The first known implementation of this standard was made by Kria. [site](https://www.kria.vc) [White Paper](https://www.kria.vc/Whitepaper-Basement-v1.pdf)

Warning: by using this implementation you are NOT, by any means, exempted of checking your project compliance against CVM regulators.

### Features added to ERC-20 standard

A **burnFor()** function was added to the standard in order to grant the token owner administrative privileges, in the event of users losing their private keys. The key of this feature, restricted to the token owner only, is to be part of a process started off-chain, ending with user's tokens being burn and minted to his/her new public address.

### Differences to ERC-20 standard

Because it was developed to be compliant to CVM's regulatory criteria, the ST-588 behaves differently to the ERC-20 in the following ways:

* Restricted access: while in ERC-20 access to tokens and transactions is open to everyone, in the ST-588 both access and transactions are controlled by the token owner through a whitelist; means that only previously allowed participants can make token transactions. The onboarding process (usually, KYC and AML checks) must be made off-chain.
* Restricted burns: in ERC-20 it's possible to burn tokens by transferring them to an empty address (0x0). In ST-588 that behavior was restricted to the token owner, as it was created to represent legal assets and those assets remain off-chain processes to be burnt.

## Build & Tests

Requirements:
- node.js >= 8.0.0

```
npm i
npm test
```
