import json
from classes import Event, Participant
import smtplib
import sys



def lambda_handler(event, context):
    eventObject=JSONtoEvent(event)
    if len(eventObject.participants)==eventObject.min:
        sendEmail(eventObject)
    elif len(eventObject.participants) > eventObject.min:
        sendEmailToLast(eventObject)


#convert JSON to Event
def JSONtoEvent(j: json):

    event= Event(j["min"], j["max"], j["Location"], j["Time"], j["Title"], j["Description"])

    persons=[]
    for participant in j["Participants"].values():
        print(participant["Email"])
        persons.append(Participant(participant["Email"], participant["Name"]))

    event.addParticipants(persons)
    print(persons)
    
    return event

def sendEmailToLast(event):

    sender_email = 'frisboysproject@gmail.com'
    password = 'amherst123'
    participants=event.participants
    

    receiver_emails = []
    receiver_emails.append(participants[-1].getEmail())


    names=[]
    for p in participants:
        names.append(p.getName())


    # Email text
    email_body = '''Subject: Your Hangout Event\n
    \nHello, you have an update from Hangout!
    '''

    email_body+=('\nYour event is on!\n\n' +"\nTime: "+event.time+ "\nTitle: " + event.title + "\nDescription: " + event.description+ "\nLocation: " + event.location +"\n\nParticipants:\n")

    for count, name in enumerate(names):
        email_body+=("\n"+str(count+1)+". "+  name)

    email_body += ("\n\n\nSee you there!")
    

    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.ehlo()
    server.starttls()
    server.ehlo()

    server.login(sender_email, password)
    # Sending email from sender, to receiver with the email body
    server.sendmail(sender_email, receiver_emails, email_body)
    print('Email sent!')

    print('Closing the server...')
    server.quit()

#SEND THE EMAIL
def sendEmail(event):
    sender_email = 'frisboysproject@gmail.com'
    password = 'amherst123'
    participants=event.participants
    

    receiver_emails = []
    for p in participants:
        receiver_emails.append(p.getEmail())


    names=[]
    for p in participants:
        names.append(p.getName())


    # Email text
    email_body = '''Subject: Your Hangout Event\n
    \nHello, you have an update from Hangout!
    '''

    email_body+=('\nYour event is on!\n\n' +"\nTime: "+event.time+ "\nTitle: " + event.title + "\nDescription: " + event.description+ "\nLocation: " + event.location +"\n\nParticipants:\n")

    for count, name in enumerate(names):
        email_body+=("\n"+str(count+1)+". "+  name)

    email_body += ("\n\n\nSee you there!")
    

    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.ehlo()
    server.starttls()
    server.ehlo()

    server.login(sender_email, password)
    # Sending email from sender, to receiver with the email body
    server.sendmail(sender_email, receiver_emails, email_body)
    print('Email sent!')

    print('Closing the server...')
    server.quit()
    
    return "successs!!!!"



#DETERMINE FROM JSON if minpart is reached
def greaterThanMin(j: json):
    jParsed = json.loads(j)
    if len(jParsed["Participants"]) >= int(jParsed["min"]):
        sendEmail(JSONtoEvent(j))
        return True
    else:
        return False


def lessThanMax(j: json):
    jParsed = json.loads(j)
    if len(jParsed["Participants"]) <= int(jParsed["max"]):
        return True
    else:
        return False


