<%@ Page Language="C#" %>

<%@ Import Namespace="System.Collections.Generic" %>
<%@ Import Namespace="System.Configuration" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Web.Script.Serialization" %>

<script runat="server">
	//_____________________________________________________________________________ PRIVATE MEMBERS
	private string _appRootURL = string.Empty;
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
        if (!String.IsNullOrEmpty(Request["dir"]))
        {
            urlPath += Request["dir"].Replace("..", "");
        }

        if (!String.IsNullOrEmpty(Request["glob[]"]))
        {
            urlPath += Request["glob[]"].Substring(0, Request["glob[]"].LastIndexOf('/'));
        }

        string dir = Server.MapPath(urlPath);
        string pattern = !String.IsNullOrEmpty(Request["glob[]"]) ? Request["glob[]"].Substring(Request["glob[]"].LastIndexOf('/') + 1) : "";

        string[] files = Directory.GetFiles(dir, pattern);
        for (int i = 0; i < files.Length; i++)
        {
            files[i] = files[i].Substring(this.AppRootPath.Length).Replace("\\", "/"); ;
        }

        JavaScriptSerializer serializer = new JavaScriptSerializer();
        Response.Write(serializer.Serialize(files));
    }
</script>