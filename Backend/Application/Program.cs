using DataAccessLayer.data;
using Medfar.Interview.DAL.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Add JsonSerializerOptions.ReferenceHandler in case we need to join complex data tables by using EFcore.include in the future 
builder.Services.AddControllers().AddJsonOptions(x =>
                x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// when a new scope is created during the lifetime of the application, a new instance of UserRepository will be created and used within that scope
builder.Services.AddScoped<UserRepository>();
//DBcontext setup
builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// Add CORS configuration to allow my localhost front-end server to access the API
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        builder =>
        {
            builder.WithOrigins("http://localhost:3000")
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors();

// security configuaration
app.Use(async (context, next) =>
{
    //Adding the HSTS header is a good security practice for websites that use HTTPS to protect sensitive data and ensure secure connections.
    //Automatically convert all insecure HTTP links to secure HTTPS links for the specified domain and its subdomains. Prevent the user from bypassing any SSL / TLS - related warnings, which helps prevent man-in-the - middle attacks.
    //
    // DISABLED for development since I need to clear your browser cache may be necessary to ensure that the browser fetches the updated STS header from your application and applies the redirect correctly. If you do not clear the cache, the browser
    // may still have the previous STS header cached, which could cause it to continue redirecting HTTP requests to HTTPS even after the STS header has been removed from your application.

    // context.Response.Headers.Add("strict-transport-security", "max-age=31536000; includeSubDomains");

    //to prevent your site from being embedded within an iframe, which can help protect against clickjacking attacks
    context.Response.Headers.Add("X-Frame-Options", "SAMEORIGIN");
    //specifies that the browser should only load resources (scripts, images, styles, etc.) from the same origin as the page itself. This can help prevent the loading of malicious resources from external sources.
    context.Response.Headers.Add("Content-Security-Policy", "default-src 'self'");
    // it instructs the browser not to perform MIME type sniffing on the response. MIME type sniffing is when the browser attempts to interpret the content type of a resource based on the content itself, rather than relying on the Content-Type header. 
    context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
    // sends the full URL as a referrer when requests are made within the same origin, and only sends the origin (scheme, host, and port) when requests are made to a different origin
    context.Response.Headers.Add("Referrer-Policy", "strict-origin-when-cross-origin");
    // Sets all these features to only be allowed if they are requested from the same origin. Any third party iframes etc will not allow the following features.
    context.Response.Headers.Add("Feature-Policy",
        "accelerometer 'self'; ambient-light-sensor 'self';autoplay 'self';battery 'self';camera 'self';display-capture 'self';document-domain 'self';encrypted-media 'self';execution-while-not-rendered 'self';execution-while-out-of-viewport 'self';fullscreen 'self';gamepad 'self';geolocation 'self';gyroscope 'self';layout-animations 'self';legacy-image-formats 'self';magnetometer 'self';microphone 'self';midi 'self';navigation-override 'self';oversized-images 'self';payment 'self';picture-in-picture 'self';publickey-credentials-get 'self';sync-xhr 'self';unoptimized-images'self';unsized-media'self';usb 'self';vibrate'self';vr'self';screen-wake-lock 'self';web-share 'self';xr-spatial-tracking 'self';");

    await next();
});

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
