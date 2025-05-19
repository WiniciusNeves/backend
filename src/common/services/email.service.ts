import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'athusprojeto@gmail.com',
                pass: 'wdhq qlef qnbk dubh', // senha de aplicativo (NÃO a senha normal)
            },
        });
    }

    async sendVerificationCode(email: string, code: string) {
        await this.transporter.sendMail({
            from: '"FACILITA" <athusprojeto@gmail.com>',
            to: email,
            subject: '🔒 Código de verificação de e-mail - FACILITA',
            html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; padding: 30px;">
      <div style="text-align: center; padding-bottom: 20px;">
        <img src="https://imgur.com/a/CbVvc71" alt="FACILITA" style="height: 60px;" />
      </div>

      <h2 style="color: #2d3748;">Verificação de E-mail</h2>
      <p style="font-size: 16px; color: #4a5568;">
        Olá! Estamos quase lá. Para concluir seu cadastro no <strong>FACILITA</strong>, por favor utilize o código abaixo para verificar seu e-mail:
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <div style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; border-radius: 8px; font-size: 24px; letter-spacing: 4px;">
          ${code}
        </div>
      </div>

      <p style="font-size: 14px; color: #718096;">
        Se você não solicitou esse código, por favor ignore este e-mail.
      </p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;" />

      <p style="font-size: 12px; color: #a0aec0; text-align: center;">
        Este é um e-mail automático, por favor não responda. <br />
        © ${new Date().getFullYear()} FACILITA. Todos os direitos reservados.
      </p>
    </div>
  `,
        });
        console.log(`Código de verificação enviado para ${email}: ${code}`);
    }
}
