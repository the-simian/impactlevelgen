<%@ Page Language="C#" %>

<%@ Import Namespace="System.Collections.Generic" %>
<%@ Import Namespace="System.Configuration" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Web.Script.Serialization" %>

<script runat="server">
	//_____________________________________________________________________________ PRIVATE MEMBERS
	private string _appRootURL  = string.Empty;
	private string _appRootPath = string.Empty;
	
	//________________________________________________________________________ PROTECTED PROPERTIES
	/// <summary>
	/// The root of the application in web/URL form.
	/// </summary>
	protected string AppRootURL
	{
		get
		{
			if (_appRootURL.Equals(string.Empty))
			{
				_appRootURL = Request.ApplicationPath + ConfigurationManager.AppSettings["fileRoot"];
				if (_appRootURL[_appRootURL.Length - 1] != '/')
				{
					_appRootURL += "/";
				}
			}
			
			return _appRootURL;
		}
	}

	/// <summary>
	/// The root of the application in filesystem/path form.
	/// </summary>
	protected string AppRootPath
	{
		get
		{
			if (_appRootPath.Equals(string.Empty))
			{
				_appRootPath = Server.MapPath(this.AppRootURL);
			}

			return _appRootPath;
		}
	}
	
	
	//______________________________________________________________________________ EVENT HANDLERS
	/// <summary>
	/// Code that needs to run as the page is loading.
	/// </summary>
	/// <param name="sender">The object that triggered this event.</param>
	/// <param name="e">Any arguments passed to the event.</param>
	protected void Page_Load(object sender, EventArgs e)
	{	
		string urlPath = this.AppRootURL;
		if (!String.IsNullOrEmpty(Request["dir"]) && !urlPath.Contains(Request["dir"]))
		{	
			urlPath += Request["dir"].Replace("..", "");
		}
		string dir = Server.MapPath(urlPath);
		
		string[] pattern = new string[]{"*.*"};
		switch (Request["type"]) {
			case "images": 
				pattern = new string[]{"*.png", "*.gif", "*.jpg", "*.jpeg"};
				break;
			case "scripts":
				pattern = new string[]{"*.js"};
				break;
		}

		string[] dirs  = Directory.GetDirectories(dir);
		for (int i = 0; i < dirs.Length; i++)
		{
			dirs[i] = dirs[i].Substring(dir.Length).Replace("\\", "/");
		}
		
		ArrayList foundFiles = FindFiles(dir, pattern);
		string[] files = new string[foundFiles.Count];	
		for (int i = 0; i < foundFiles.Count; i++)
		{
			files[i] = ((string)foundFiles[i]).Substring(this.AppRootPath.Length).Replace("\\", "/");
		}
		
		Dictionary<string, object> data = new Dictionary<string,object>();
		
		if (dir.Equals(this.AppRootPath))
		{
			data["parent"] = false;
		}
		else
		{
			DirectoryInfo thisDir = new DirectoryInfo(dir);
			string appPath = Server.MapPath(Request.ApplicationPath);
			data["parent"] = AppRootURL + thisDir.Parent.FullName.Substring(appPath.Length).Replace("\\", "/");
		}
		
		data["dirs"]  = dirs;
		data["files"] = files;

		JavaScriptSerializer serializer = new JavaScriptSerializer();
        Response.Write(serializer.Serialize(data));
	}
	
	
	//______________________________________________________________________________________ METHODS
	/// <summary>
	/// Directory.GetFiles() can only search a directory for one file extension at a time.
	/// This method allows you to repeatedly search a directory for as many filetypes as you wish.
	/// </summary>
	/// <param name="path">The path to look in.</param>
	/// <param name="fileTypes">A string array of search filters (*.xxx)</param>
	/// <returns>An ArrayList of files that match one of the passed-in file types.</returns>
	private ArrayList FindFiles(string path, string[] fileTypes)
	{
		ArrayList foundFiles = new ArrayList();

		for (int i = 0; i < fileTypes.Length; i++)
		{
			foundFiles.AddRange(Directory.GetFiles(path, fileTypes[i]));
		}
		
		return foundFiles;
	}
</script>