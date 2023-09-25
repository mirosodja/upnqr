# https://pyfpdf.github.io/fpdf2/
# https://segno.readthedocs.io/en/stable/make.html
import io
from fpdf import FPDF
import segno
import os
from datetime import datetime

basedir = os.path.abspath(os.path.dirname(__file__))
file_font = basedir+"/font/FreeMono.ttf"


def main():
    print('Not allowed from console!')


def upn4pdf(osebas: list, dest_output="S"):
    for key, value in enumerate(osebas):
        osebas[key] = remove_spaces(oseba=value)
    pdf = createUpnQrPdf(osebas=osebas, pdf_page_format='A4')
    if dest_output != "S":
        pdf.output(dest_output)
    else:
        return pdf.output(dest=dest_output)


def upn4zip(oseba: dict, dest_output="S"):
    """\
        Prepare data for ziping pdfs and return pdf 
    """
    oseba = remove_spaces(oseba=oseba)
    pdf = createUpnQrPdf(osebas=[oseba], pdf_page_format='A5')
    if dest_output != "S":
        pdf.output(dest_output)
    else:
        return pdf.output(dest=dest_output)


def createUpnQrPdf(osebas: list, pdf_page_format: str):
    """\
        Create pdf
    """
    # set document information
    if pdf_page_format == 'A4':
        pdf = FPDF(format=pdf_page_format)
    else:
        pdf = FPDF(format=(210, 99), unit="mm")
    pdf.add_font('font_print', fname=file_font, uni=True)
    pdf.set_author("potep.in")
    pdf.set_title("UPN izpis nalogov")
    pdf.set_subject("Izpis UPN QR nalogov")
    pdf.set_keywords("UPN QR")
    pdf.set_margins(0, 0, 0)
    pdf.set_auto_page_break(auto=True, margin=0)

    XpomikPrinterja = 1 if (pdf_page_format == 'A4') else 0
    YpomikPrinterja = -0.5 if (pdf_page_format == "A4") else 0
    YpresledekMedNalogi = 13.5
    # Multicell
    # odmik od robu
    # po Y
    odmikPredInPo = 0
    widthTalonNormal = 52.5  # šriina okenca normal
    widthTalonLess = 40
    xTalonNormal = 4 + XpomikPrinterja
    xTalonMore = 16.5 + XpomikPrinterja
    # nalog
    xNalogNormal = 63.5 + XpomikPrinterja
    xNalogMore = 106.5 + XpomikPrinterja

    #! adds UPNs
    for key, value in enumerate(osebas):
        # če je ostanek po deljenju 1
        if ((((key + 1)) % 3) == 1):
            # add a page
            pdf.add_page()
            if (pdf_page_format != 'A4'):
                # set bacground image
                img_file = basedir+'/img/upnqr.jpg'
                pdf.image(img_file, 0, 0, 210, 99)
            currentY = pdf.get_y() + YpomikPrinterja + odmikPredInPo
        elif ((((key + 1)) % 3) == 2):
            currentY = pdf.get_y() + YpomikPrinterja + YpresledekMedNalogi + odmikPredInPo * 3
        else:
            currentY = pdf.get_y() + YpomikPrinterja + YpresledekMedNalogi + odmikPredInPo * 5

        # string formating
        value['imePlacnik'] = prepare1vrstico2vrstice3(value['imePlacnik'])
        value['imePrejemnik'] = prepare1vrstico2vrstice3(value['imePrejemnik'])
        img_qrCodeString = prepareString4Qrcode(value)
        value['znesek'] = "***{:,.2f}".format(float(value["znesek"])).replace(
            ".", ";").replace(",", ".").replace(";", ",")
        # talon
        # set font
        pdf.set_font('font_print', '', 8)
        pdf.set_xy(xTalonNormal, currentY + 8)
        pdf.multi_cell(w=widthTalonNormal,
                       txt=value["imePlacnik"], border=0, align='L', ln=1)
        pdf.set_xy(xTalonNormal, currentY+24)
        pdf.multi_cell(w=widthTalonNormal,
                       txt=value['namen_rok_placila'], border=0, align='L', ln=1)
        pdf.set_xy(xTalonMore, currentY+36)
        pdf.multi_cell(w=widthTalonLess,
                       txt=value["znesek"], border=0, align='L', ln=1)
        pdf.set_xy(xTalonNormal, currentY+45)
        pdf.multi_cell(w=widthTalonNormal,
                       txt=value["prejemnik_IBAN"]+"\n"+value["prejemnik_referenca"], border=0, align='L', ln=1)
        # pdf.set_xy(xTalonNormal, currentY+48)
        # pdf.multi_cell(w=widthTalonNormal,
        #                txt=value["prejemnik_referenca"], border=0, align='L', ln=1)
        pdf.set_xy(xTalonNormal, currentY+61)
        pdf.multi_cell(w=widthTalonNormal,
                       txt=value["imePrejemnik"], border=0, align='L', ln=1)

        # nalog
        # set font
        pdf.set_font('font_print', '', 10)
        img_qrcode = create_qrcode(img_qrCodeString)
        pdf.image(img_qrcode, xNalogNormal, currentY + 6, 39.5, 39.5)
        pdf.set_xy(xNalogMore, currentY+24)
        pdf.multi_cell(w=99,
                       txt=value['imePlacnik'], border=0, align='L', ln=1)
        pdf.set_xy(xNalogMore+20, currentY+42)
        pdf.multi_cell(w=41,
                       txt=value['znesek'], border=0, align='L', ln=1)
        pdf.set_xy(xNalogNormal, currentY+50)
        pdf.multi_cell(w=14,
                       txt=value['koda_namena'], border=0, align='L', ln=1)
        pdf.set_xy(xNalogNormal+17, currentY+50)
        pdf.multi_cell(w=112,
                       txt=value['namen_rok_placila'], border=0, align='L', ln=1)
        pdf.set_xy(xNalogNormal, currentY+59)
        pdf.multi_cell(w=127,
                       txt=value['prejemnik_IBAN'], border=0, align='L', ln=1)
        pdf.set_xy(xNalogNormal+5, currentY+67)
        pdf.multi_cell(w=92,
                       txt=value['prejemnik_referenca'], border=0, align='L', ln=1)
        pdf.set_xy(xNalogNormal, currentY+75)
        pdf.multi_cell(w=131,
                       txt=value['imePrejemnik'], border=0, align='L', ln=1)

    # Close and return PDF document
    return pdf


def prepare1vrstico2vrstice3(vrstica: str):
    """\
        Prepare imePriimek and imePrejemnik in which is also street and post: imePriimek->imePriimek+chr(10)+ulica+chr(10)+posta
        :param vrstica: imePriimek, ulica, psota
        :type vrstica: string
        :rtype: string
    """
    vrstica = vrstica.replace(", ", ",", 2).replace(",", "\n", 2)
    for _ in range(vrstica.count("\n"), 2):
        vrstica = vrstica+("\n")
    return vrstica


def prepareString4Qrcode(oseba: dict):
    """\
        Prepare string for qrcode: string for qr code and for printing in pdf document
        :param oseba: oseba as dict
        :type oseba: dict
        :rtype: string
    """
    arrKeys = ["konstanta", "placnik_IBAN", "polog", "dvig", "placnik_referenca", "imePlacnik", "znesek", "datum_placila",
               "nujno", "koda_namena", "namen_rok_placila", "rok_placila", "prejemnik_IBAN", "prejemnik_referenca", "imePrejemnik"]
    data4Qrcode: dict = {i: '' for i in arrKeys}

    for key in data4Qrcode:
        if key in oseba:
            data4Qrcode[key] = oseba[key]

    data4Qrcode["konstanta"] = "UPNQR"
    # "{:012.2f}".format(1.2).replace(".","")
    data4Qrcode["znesek"] = "{:012.2f}".format(
        float(data4Qrcode["znesek"])).replace(".", "")
    data4Qrcode["prejemnik_IBAN"] = data4Qrcode["prejemnik_IBAN"].replace(
        ' ', '')
    data4Qrcode["prejemnik_referenca"] = data4Qrcode["prejemnik_referenca"].replace(
        ' ', '')
    string = "".join(value + "\n" for key, value in data4Qrcode.items())
    string = string+"{:03.0f}".format(len(string))+"\n "
    return string


def create_qrcode(qrcode_string: str):
    """\
        Creating QrCode as image
        :param oseba: oseba as dict
        :type oseba: dict
        :rtype: img
    """
    buff = io.BytesIO()
    qr = segno.make_qr(qrcode_string, error="m", version=15,
                       encoding="ISO-8859-2", eci=True, boost_error=False)
    qr.save(buff, kind="png", scale=10)
    # qr.save('test.png', scale=39.5, border=None, dpi=600)
    buff.seek(0)
    return buff


def remove_spaces(oseba: dict):
    # remove spaces in value
    for key, value in oseba.items():
        if type(value) == str:
            oseba[key] = value.strip()
    return oseba


if __name__ == "__main__":
    main()
