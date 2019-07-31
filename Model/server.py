from aiohttp import web
import socketio
import pyautogui
from win32com.shell import shell, shellcon
import os
import json
import threading
import socket
from subprocess import PIPE, Popen


sio = socketio.AsyncServer()
app = web.Application()
sio.attach(app)
dataRecord = []
dataRecordIndex = 0
dataRecordJson = {0:0, 1:0, 2:0, 3:0, 4:0}
fileContent = ""
directory = ""
subject = 0
session = 0


@sio.on('type')
async def print_message(sid, message):
    pyautogui.typewrite(message['data'], .2)
    await sio.emit('send', {'data': 2})

@sio.on('pressGui')
async def print_message(sid, message):
    pyautogui.press(message['data'])

@sio.on('typeGui')
async def print_message(sid, message):
    pyautogui.typewrite(message['data'], .2)

@sio.on('send')
async def print_message(sid, message):
    print("Key Chosen: ", message)
    await sio.emit('send', {'data': str(message['data'])})

@sio.on('openFile')
async def runFunction(sid, message):
    global directory
    fileContent = openFile(directory, message['name'], message['mainClass'])
    await sio.emit('openFile', {'data': str(fileContent)})

@sio.on('saveFile')
async def runFunction(sid, message):
    global directory
    state = saveFile(directory, message['name'], message['data'])
    await sio.emit('saveFile', {'data': str(state)})

@sio.on('getList')
async def runFunction(sid, message):
    global directory
    await sio.emit('getList', {'data': json.dumps(getlist(directory)), 'directory': directory})

@sio.on('createDirectory')
async def runFunction(sid, message):
    global directory
    directory = createDir(directory, message['name'])
    await sio.emit('createDirectory', {'data':  json.dumps(getlist(directory)), 'directory': directory})

@sio.on('changeDirectory')
async def runFunction(sid, message):
    global directory
    directory = changeDirectory(directory, message['name'])
    await sio.emit('changeDirectory', {'data': json.dumps(getlist(directory)), 'directory': directory})

@sio.on('goBackDirectory')
async def runFunction(sid, message):
    global directory
    directory = goBackDirectory(directory, message['num'])
    await sio.emit('goBackDirectory', {'data': json.dumps(getlist(directory)), 'directory': directory})

@sio.on('runCode')
async def runFunction(sid, message):
    global directory
    output = runCode(directory, message['name'], message['data'])
    await sio.emit('runCode', {'data': str(output)})

def openFile(directory, name, mainClass):
    try:
        f = open(directory + name, "r+")
        fileContent = f.read()
        f.close()
    except:
        f = open(directory + name, "w+")
        if mainClass:
            fileContent = "public class {} {}"\
                .format(name.split(".")[0], """{
    public static void main(String[] args) { 
        
        
        
        
    }
}""")
        else:
            fileContent = "public class {} {}"\
                .format(name.split(".")[0], """{



}""")
        f.close()
    return fileContent

def saveFile(directory, name, fileContent):
    try:
        f = open(directory + name, "w+")
        f.write(fileContent)
        f.close()
        return 'done'
    except Exception as e:
        return e

def getlist(directory):
    return os.listdir(directory)

def createDir(directory, name):
    try:
        os.mkdir(directory + name)
    except:
        pass
    return directory + name  + "\\"

def changeDirectory(directory, name):
    directory = directory + name + "\\"
    return directory

def goBackDirectory(directory, numDirectories):
    directorys = directory.split("\\")
    for i in range(numDirectories + 1):
        directorys.pop()
    directory = "\\".join(directorys) + "\\"
    return directory

def runCode(directory, name, fileContent):
    try:
        print(directory, name)
        f = open(directory + name, "w+")
        f.write(fileContent)
        f.close()
        p = Popen(['javac', directory + name], stdout=PIPE, stderr=PIPE)
        output, error = p.communicate()
        print(error)
        if len(error) == 0:
            p = Popen(['java', name.split('.')[0]], stdout=PIPE, stderr=PIPE, cwd=directory)
            output, error = p.communicate()
            print(error)
            if len(error) == 0:
                return output.decode("utf-8")
            else:
                return error.decode("utf-8")
        else:
            return output.decode("utf-8")
    except Exception as e:
        print(e)
        return e

if __name__ == '__main__':
    # web.run_app(app, port=8080)
    fileContent = ""
    directory = shell.SHGetFolderPath(0, shellcon.CSIDL_PERSONAL, None, 0) + "\\BCI\\"
    try:
        os.mkdir(directory)
    except:
        pass
    web.run_app(app)