<%@ Page Language="C#" %>

<%@ Import Namespace="System.Collections.Generic" %>
<%@ Import Namespace="System.Configuration" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Text.RegularExpressions" %>
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
		Dictionary<string, object> result = new Dictionary<string, object>();
		result["error"] = 0;
		
		if (!String.IsNullOrEmpty(Request["path"]) && !String.IsNullOrEmpty(Request["data"]))
		{
			string url = this.AppRootURL + Request["path"].Replace("..", "");
			if (Regex.IsMatch(url, @"^.+\.((js))$"))
			{
				string path = Server.MapPath(url);
				TextWriter tw = new StreamWriter(path);
				try
				{
					tw.Write(Request["data"]);
				}
				catch
				{
					result["error"] = "2";
					result["msg"]   = "Couldn't write to file: " + url;
				}
				finally
				{
					tw.Close();
				}
			}
			else
			{
				result["error"] = "3";
				result["msg"]   = "File must have a .js suffix";
			}
		}
		else
		{
			result["error"] = "1";
			result["msg"]   = "No Data or Path specified";
		}

		JavaScriptSerializer serializer = new JavaScriptSerializer();
        Response.Write(serializer.Serialize(result));
	}
</script>