import express from "express";
import path from "path";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON requests
  app.use(express.json());

  // API Route - Sends Lead Details via Email
  app.post("/api/send-email", async (req, res) => {
    try {
      const { lead, estimate, extraInfo } = req.body;
      
      console.log("📝 Received lead submission for email notification:", { lead, estimate, extraInfo });

      const notificationEmail = process.env.NOTIFICATION_EMAIL || "8996215@gmail.com";
      const smtpHost = process.env.SMTP_HOST;
      const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465;
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;

      // Check if SMTP credentials are configured.
      // If not, print a readable debug block and return success to ensure fluid UX in development
      if (!smtpUser || !smtpPass) {
        console.warn("\n⚠️ ========== SMTP NOT CONFIGURED ==========");
        console.warn("SMTP_USER or SMTP_PASS environment variables are missing.");
        console.warn("To receive actual email alerts, configure SMTP settings in the AI Studio environment settings.");
        console.warn("Printing details of the submitted Lead:");
        console.warn(`👤 Full Name: ${lead?.fullName}`);
        console.warn(`📞 Phone: ${lead?.phone}`);
        console.warn(`📧 Email: ${lead?.email}`);
        console.warn(`📅 Year: ${lead?.taxYear}`);
        console.warn(`💵 Estimated Refund: ₪${estimate?.toLocaleString()}`);
        console.warn(`💬 Comments/Extra details: ${lead?.comments || 'None'}`);
        if (extraInfo?.files) {
          console.warn(`📂 Attached Files: ${extraInfo.files.map((f: any) => f.name).join(", ")}`);
        }
        console.warn("============================================\n");

        return res.status(200).json({ 
          success: true, 
          message: "עבודה ללא דופי! הליד נשמר בהצלחה בשרת. (המסך כעת ב-Development ללא הגדרת SMTP שרת).",
          smtpConfigured: false
        });
      }

      // Configure Nodemailer transporter
      const transporter = nodemailer.createTransport({
        host: smtpHost || "smtp.gmail.com",
        port: smtpPort,
        secure: smtpPort === 465, // True for port 465 SSL, otherwise false (TLS/unsecured)
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      const isAdvanced = !!(extraInfo?.files && extraInfo.files.length > 0);
      const filesList = isAdvanced ? extraInfo.files.map((f: any) => `<li>${f.name} (${(f.size / 1024).toFixed(1)} KB)</li>`).join("") : "";

      // Generate detailed eligibility reasons helper for email body
      const getEligibilityReasonsList = (state: any) => {
        if (!state) return [];
        const list: string[] = [];
        
        if (state.monthsWorked < 12) {
          list.push(`עבד רק ${state.monthsWorked} חודשים מתוך 12 השנה (חוסר רציפות תעסוקתית)`);
        }
        if (state.isMiloimnik) {
          list.push(`שירת במילואים פעילים השנה ${state.miloimDays ? `(${state.miloimDays} ימים)` : ''}`);
        }
        if (state.newChildren > 0) {
          list.push(`נולד/ה או אומץ/ה ילד/ה במהלך השנה (${state.newChildren} ילדים חדשים)`);
        }
        if (state.hasUnemployment) {
          list.push(`קיבל דמי אבטלה במהלך השנה ${state.unemploymentMonths ? `(${state.unemploymentMonths} חודשים)` : ''}`);
        }
        if (state.changedEmployer) {
          list.push("החליף מעסיקים במהלך השנה ללא ביצוע תיאום מס");
        }
        if (state.donationsAmount > 0) {
          list.push(`תרם למוסדות מוכרים (סעיף 46) בסך ₪${state.donationsAmount}`);
        }
        if (state.livedInTaxTargetArea) {
          list.push("התגורר או עבר ליישוב מוטב מס");
        }
        if (state.dischargedSoldier) {
          list.push("חייל משוחרר / מסיים שירות לאומי ב-3 השנים האחרונות");
        }
        if (state.finishedDegree) {
          list.push("סיים תואר אקדמי או מקצועי בשנתיים האחרונות");
        }
        if (state.independentPensionDeposits) {
          const pensionStr = state.pensionDepositAmount > 0 ? `קופת פנסיה בסך ₪${state.pensionDepositAmount}` : '';
          const hishtalmutStr = state.hishtalmutDepositAmount > 0 ? `קרן השתלמות בסך ₪${state.hishtalmutDepositAmount}` : '';
          const details = [pensionStr, hishtalmutStr].filter(Boolean).join(' ו-');
          list.push(`ביצע הפקדות עצמאיות לקופת גמל/פנסיה/השתלמות ${details ? `(${details})` : ''}`);
        }
        if (state.childWithLearningDisabilities) {
          list.push("הורה לילד המאובחן עם לקות למידה או בחינוך מיוחד");
        }
        if (state.singleParentOrDivorcedPaysAlimony) {
          list.push("הורה יחיד או גרוש המשלם דמי מזונות");
        }
        if (state.newImmigrantOrReturningResident) {
          list.push("עולה חדש או תושב חוזר ותיק");
        }
        
        return list;
      };

      const emailHtml = `
        <div style="direction: rtl; text-align: right; font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #1e293b, #0f172a); color: #ffffff; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
            <h2 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">🎉 התקבל ליד חדש במערכת!</h2>
            <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.9;">פרטי לקוח חדש שהתקבלו דרך ${isAdvanced ? 'המסלול של הטפסים (מתקדמים)' : 'סימולטור המחשבון המהיר'}</p>
          </div>
          
          <div style="padding: 24px; color: #1e293b;">
            <h3 style="border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 0; color: #0f172a; font-size: 16px;">👤 פרטי הלקוח</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #64748b; width: 30%;">שם מלא:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a;">${lead.fullName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #64748b;">מספר טלפון:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; direction: ltr; text-align: right;">${lead.phone}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #64748b;">אימייל:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; direction: ltr; text-align: right;">${lead.email}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #64748b;">שנת מס מבוקשת:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a;">${lead.taxYear || 'לא צוין'}</td>
              </tr>
              ${lead.comments ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #64748b; vertical-align: top;">הערות חופשיות:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a;">${lead.comments}</td>
              </tr>
              ` : ''}
            </table>

            <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: center;">
              <p style="margin: 0; font-size: 13px; color: #64748b; font-weight: bold;">💰 החזר מס מוערך במחשבון</p>
              <p style="margin: 6px 0 0 0; font-size: 32px; font-weight: 900; color: #16a34a;">₪${estimate.toLocaleString()}</p>
            </div>

            ${isAdvanced ? `
              <div style="margin-top: 20px; padding: 15px; background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px;">
                <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; color: #1e40af;">📂 קבצים וטפסים שצורפו:</h4>
                <ul style="margin: 0; padding-right: 20px; font-size: 13px; color: #1e3a8a;">
                  ${filesList}
                </ul>
              </div>
            ` : ''}

            ${extraInfo?.calculatorState ? `
              <h3 style="border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 24px; color: #0f172a; font-size: 15px;">⚙️ בחירות והגדרות במחשבון</h3>
              <div style="font-size: 12px; color: #475569; background-color: #fafafa; padding: 12px; border-radius: 6px; line-height: 1.6; margin-bottom: 20px;">
                <ul style="margin: 0; padding-right: 18px;">
                  <li>הכנסה חודשית ממוצעת: ₪${(extraInfo.calculatorState.averageSalary || extraInfo.calculatorState.monthlySalary || 0).toLocaleString()}</li>
                  <li>שירות מילואים פעיל: ${extraInfo.calculatorState.isMiloimnik ? `כן (${extraInfo.calculatorState.miloimDays} ימים)` : 'לא'}</li>
                  <li>עולה חדש / תושב חוזר ותיק: ${extraInfo.calculatorState.newImmigrantOrReturningResident ? 'כן (נקודת זיכוי נוספת)' : 'לא'}</li>
                  <li>סיים תואר אקדמי בשנתיים האחרונות: ${extraInfo.calculatorState.finishedDegree ? 'כן (נקודת זיכוי נוספת)' : 'לא'}</li>
                  <li>ילד מאובחן עם חינוך מיוחד/לקות למידה: ${extraInfo.calculatorState.childWithLearningDisabilities ? 'כן' : 'לא'}</li>
                  <li>הורה יחיד / גרוש המשלם מזונות: ${extraInfo.calculatorState.singleParentOrDivorcedPaysAlimony ? 'כן' : 'לא'}</li>
                </ul>
              </div>

              <h3 style="border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-top: 20px; color: #0f172a; font-size: 15px;">📋 סיבות זכאות שנמצאו במחשבון</h3>
              <div style="font-size: 13px; color: #0f172a; background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 14px; border-radius: 8px; line-height: 1.6;">
                <ul style="margin: 0; padding-right: 18px; color: #166534; font-weight: bold;">
                  ${getEligibilityReasonsList(extraInfo.calculatorState).map((reason: string) => `<li>✔️ ${reason}</li>`).join('') || '<li>לא זוהו סיבות זכאות ספציפיות</li>'}
                </ul>
              </div>
            ` : ''}
          </div>
          
          <div style="font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 15px; margin-top: 20px;">
            נשלח אוטומטית ע"י המחשבון הלאומי להחזרי מס • 2026
          </div>
        </div>
      `;

      // Prepare attachments if files are sent with base64 data
      const attachments = [];
      if (isAdvanced && extraInfo?.files) {
        for (const file of extraInfo.files) {
          if (file.base64) {
            const matches = file.base64.match(/^data:(.+);base64,(.+)$/);
            if (matches) {
              const contentType = matches[1];
              const base64Data = matches[2];
              attachments.push({
                filename: file.name,
                content: Buffer.from(base64Data, "base64"),
                contentType: contentType
              });
            }
          }
        }
      }

      // Send email
      await transporter.sendMail({
        from: `"${smtpUser}" <${smtpUser}>`,
        to: notificationEmail,
        subject: `🎉 לידית חדשה במחשבון: ${lead.fullName} (₪${estimate.toLocaleString()})`,
        html: emailHtml,
        attachments: attachments
      });

      console.log(`✉️ Notification email successfully delivered to ${notificationEmail}`);
      return res.status(200).json({ success: true, message: "האימייל נשלח בהצלחה!" });

    } catch (error: any) {
      console.error("❌ Error emailing lead submission details:", error);
      return res.status(500).json({ 
        success: false, 
        message: "שגיאה פנימית בשליחת האימייל מהשרת.", 
        error: error.message 
      });
    }
  });

  // Serve Frontend with Vite Server (Development) or statically (Production)
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();
