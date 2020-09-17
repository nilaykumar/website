// dynamically generate the writing section
// the expository section uses the GitHub API
// and the preprint section uses the arXiv API

var summary;
var div = document.getElementById('exp');
var request1 = new XMLHttpRequest();
request1.onload = getSummary;
request1.open('get', 'https://api.github.com/repos/nilaykumar/math/contents/summary.json');
request1.send();

function getSummary() {
    summary = eval('(' + atob(JSON.parse(this.responseText)['content']) + ')');
    var request2 = new XMLHttpRequest();
    request2.onload = getRepoData;
    request2.open('get', 'https://api.github.com/repos/nilaykumar/math/git/trees/master?recursive=1', true);
    request2.send();
}

function getRepoData() {
    repoData = JSON.parse(this.responseText).tree;
    populateHTML(repoData);
}

function populateHTML(data) {
    // loop through each subject
    for(var subject in summary) {
        if(summary.hasOwnProperty(subject)) {
            // start a new <ul> for each subject
            var label = document.createElement('div');
            label.className = 'label';
            label.appendChild(document.createTextNode('[' + subject + ']'));
            div.appendChild(label);
            var ul = document.createElement('ul');
            // add the list items (based on name of file w/o extension)
            for(var filename in summary[subject]) {
                if(summary[subject].hasOwnProperty(filename)) {
                    var li = document.createElement('li');
                    // append the description to the <li>
                    li.appendChild(document.createTextNode(summary[subject][filename] + ':'));
                    // append links to all filetypes of that name
                    for(var i = 0; i < data.length; i++) {
                        if(data[i].path.startsWith(subject + '/' + filename)) {
                            var link = document.createElement('a');
                            link.className = 'extension';
                            var href = document.createAttribute('href');
                            var ext = data[i].path.slice(-3);
                            if(ext == 'pdf')
                                href.value = 'http://github.com/nilaykumar/math/raw/master/' + data[i].path;
                            else
                                href.value = 'http://github.com/nilaykumar/math/blob/master/' + data[i].path;
                            link.setAttributeNode(href);
                            link.appendChild(document.createTextNode(data[i].path.slice(-3)));
                            li.appendChild(link);
                        }
                    }
                    ul.appendChild(li);
                }
            }
        }
        div.appendChild(ul);
    }
}

    //for(var i = 0; i < resp.length; i++) {
    //    if(resp[i].type == 'blob') {
    //        //div.innerHTML = div.innerHTML + '<a href=\'' + 'http://github.com/nilaykumar/notes/blob/master/' + resp[i].path + '\'>' + resp[i].path + '</a>';
    //        div.innerHTML += '<li><a href=\'' + 'http://github.com/nilaykumar/notes/blob/master/' + resp[i].path + '\'>' + resp[i].path + '</a></li>';
    //    }  
    //}
