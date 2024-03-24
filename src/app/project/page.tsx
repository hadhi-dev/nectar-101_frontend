import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

const ProjectDocumentation = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-3xl">
        <Breadcrumb pageName="Project Documentation" />

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
            <h2 className="font-medium text-xl text-black dark:text-white">
              Location List With Map Picker
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              This project is a location listing application with a map picker
              component, allowing users to keep track of various locations and
              plot them on a map.
            </p>
          </div>

          <div className="p-4">
            <h3 className="font-medium text-lg text-black dark:text-white">
              Technologies Used
            </h3>
            <ul className="list-disc list-inside mt-2">
              <li>Node.js</li>
              <li>Express.js</li>
              <li>MongoDB Atlas</li>
              <li>Next.js with TypeScript</li>
              <li>Tailwind CSS</li>
            </ul>
          </div>

          <div className="p-4">
            <h3 className="font-medium text-lg text-black dark:text-white">
              Functionality Overview
            </h3>
            <ul className="list-disc list-inside mt-2">
              <li>Location table displaying saved locations</li>
              <li>Add new location with nickname, address, latitude, and longitude</li>
              <li>Integration with location search component</li>
              <li>Map component to visualize locations</li>
              <li>Edit existing location details</li>
              <li>Delete a location from the table</li>
              <li>Error handling and validation for user inputs</li>
            </ul>
          </div>

          <div className="p-4">
            <h3 className="font-medium text-lg text-black dark:text-white">
              Deployment
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              The frontend and backend are deployed on Vercel. <br />
              <strong>Frontend Repo:</strong>{" "}
              <a
                href="https://github.com/hadhi-dev/nectar-101_frontend"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                GitHub
              </a>{" "}
              <br />
              <strong>Backend Repo:</strong>{" "}
              <a
                href="https://github.com/hadhi-dev/nectar-101_backend"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                GitHub
              </a>
            </p>
          </div>

          <div className="p-4">
            <h3 className="font-medium text-lg text-black dark:text-white">
              Developer
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Developed by{" "}
              <a
                href="https://in.linkedin.com/in/iabdulhadhi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Abdul Hadhi
              </a>
            </p>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ProjectDocumentation;
